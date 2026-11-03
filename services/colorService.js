// =============================================================================
//  COLOR SERVICE — Binary Color Generator
//  Uses a 500+ color database with smart multi-stage name lookup:
//    1. Exact match
//    2. Normalized match (ignore spaces, hyphens)
//    3. Starts-with match
//    4. Contains match
//    5. Levenshtein fuzzy match (handles typos)
//  All color computation is done server-side.
// =============================================================================

const colorDatabase = require('./colorData');

// ── PRE-BUILD LOOKUP MAPS FOR PERFORMANCE ────────────────────────────────────

// Map: normalized name → color entry
const exactMap = new Map();
// Map: no-space/no-hyphen key → color entry
const compactMap = new Map();

colorDatabase.forEach(entry => {
  const norm  = entry.name.trim().toLowerCase();
  const compact = norm.replace(/[\s\-_]+/g, '');
  if (!exactMap.has(norm))    exactMap.set(norm, entry);
  if (!compactMap.has(compact)) compactMap.set(compact, entry);
});

// ── RGB → NAME MAP (exact reverse lookup) ────────────────────────────────────
const rgbToNameMap = new Map();
colorDatabase.forEach(entry => {
  const key = `${entry.r},${entry.g},${entry.b}`;
  const existing = rgbToNameMap.get(key);
  // Prefer shorter/simpler names (e.g. "peach" over "peachpuff")
  if (!existing || entry.name.length < existing.length) {
    rgbToNameMap.set(key, entry.name);
  }
});

// ── CACHES ─────────────────────────────────────────────────────────────────────
const binaryToDecimalCache = new Map();
const decimalToHexCache    = new Map();

// =============================================================================
//  UTILITY FUNCTIONS
// =============================================================================

function validateBinaryInput(s) {
  return typeof s === 'string' && /^[01]{8}$/.test(s);
}

function binaryToDecimal(bin) {
  if (binaryToDecimalCache.has(bin)) return binaryToDecimalCache.get(bin);
  let val = 0;
  for (const ch of bin) val = val * 2 + Number(ch);
  binaryToDecimalCache.set(bin, val);
  return val;
}

function decimalToHex(dec) {
  if (decimalToHexCache.has(dec)) return decimalToHexCache.get(dec);
  const hex = dec.toString(16).toUpperCase().padStart(2, '0');
  decimalToHexCache.set(dec, hex);
  return hex;
}

function getTextColor(r, g, b) {
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return brightness > 0.5 ? '#000000' : '#ffffff';
}

// ── LEVENSHTEIN DISTANCE (for fuzzy matching / typo tolerance) ───────────────
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// ── GET COLOR NAME FROM RGB (for binary → name display) ──────────────────────
function getColorName(r, g, b) {
  const key = `${r},${g},${b}`;

  // 1. Exact RGB match
  if (rgbToNameMap.has(key)) return toDisplayName(rgbToNameMap.get(key));

  // 2. Grayscale detection
  if (r === g && g === b) {
    if (r === 0)   return 'Black';
    if (r === 255) return 'White';
    if (r < 64)    return 'Dark Gray';
    if (r < 128)   return 'Dim Gray';
    if (r < 192)   return 'Gray';
    return 'Light Gray';
  }

  // 3. Find nearest color by Euclidean RGB distance
  let bestName = 'Custom Color';
  let bestDist = Infinity;
  for (const entry of colorDatabase) {
    const dist = Math.hypot(r - entry.r, g - entry.g, b - entry.b);
    if (dist < bestDist) {
      bestDist = dist;
      bestName = entry.name;
    }
  }
  return toDisplayName(bestName);
}

// Convert stored name to display name (Title Case)
function toDisplayName(name) {
  return name.replace(/\b\w/g, c => c.toUpperCase());
}

// ── SMART NAME LOOKUP ─────────────────────────────────────────────────────────
// Returns { r, g, b, displayName } or null
function lookupByName(rawInput) {
  const input   = rawInput.trim().toLowerCase();
  const compact = input.replace(/[\s\-_]+/g, '');

  // Stage 1: Exact normalized match
  if (exactMap.has(input)) {
    const e = exactMap.get(input);
    return { r: e.r, g: e.g, b: e.b, displayName: toDisplayName(e.name) };
  }

  // Stage 2: Compact match (no spaces/hyphens — e.g. "skyblue" → "sky blue")
  if (compactMap.has(compact)) {
    const e = compactMap.get(compact);
    return { r: e.r, g: e.g, b: e.b, displayName: toDisplayName(e.name) };
  }

  // Stage 3: Starts-with match (longest matching prefix wins)
  let startsWithMatch = null;
  let startsWithLen   = -1;
  for (const [norm, entry] of exactMap) {
    if (norm.startsWith(input) || input.startsWith(norm)) {
      if (norm.length > startsWithLen) {
        startsWithLen   = norm.length;
        startsWithMatch = entry;
      }
    }
  }
  if (startsWithMatch) {
    return {
      r: startsWithMatch.r,
      g: startsWithMatch.g,
      b: startsWithMatch.b,
      displayName: toDisplayName(startsWithMatch.name),
    };
  }

  // Stage 4: Contains match (input word appears anywhere in the color name)
  for (const [norm, entry] of exactMap) {
    if (norm.includes(input) || input.includes(norm)) {
      return { r: entry.r, g: entry.g, b: entry.b, displayName: toDisplayName(entry.name) };
    }
  }

  // Stage 5: Fuzzy / Levenshtein match (tolerates typos, max distance = 2)
  let bestEntry = null;
  let bestDist  = 3; // threshold — anything above 2 is ignored
  for (const [norm, entry] of exactMap) {
    const d = levenshtein(input, norm);
    if (d < bestDist) {
      bestDist  = d;
      bestEntry = entry;
    }
    // Also try compact version of database name
    const compactNorm = norm.replace(/[\s\-_]+/g, '');
    const d2 = levenshtein(compact, compactNorm);
    if (d2 < bestDist) {
      bestDist  = d2;
      bestEntry = entry;
    }
  }
  if (bestEntry) {
    return {
      r: bestEntry.r,
      g: bestEntry.g,
      b: bestEntry.b,
      displayName: toDisplayName(bestEntry.name),
    };
  }

  return null; // truly not found
}

// ── FIND SIMILAR COLOR SUGGESTIONS ───────────────────────────────────────────
function getSuggestions(rawInput, limit = 5) {
  const input = rawInput.trim().toLowerCase();
  const scored = [];
  for (const [norm] of exactMap) {
    scored.push({ name: norm, dist: levenshtein(input, norm) });
  }
  return scored
    .sort((a, b) => a.dist - b.dist)
    .slice(0, limit)
    .map(s => toDisplayName(s.name));
}

// =============================================================================
//  MAIN BUSINESS LOGIC
// =============================================================================

function generateFromBinary(red, green, blue) {
  if (!validateBinaryInput(red) || !validateBinaryInput(green) || !validateBinaryInput(blue)) {
    return {
      success: false,
      error: 'Invalid input. Each channel must be exactly 8 bits (0s and 1s only).',
    };
  }

  const r = binaryToDecimal(red);
  const g = binaryToDecimal(green);
  const b = binaryToDecimal(blue);

  const hex       = `#${decimalToHex(r)}${decimalToHex(g)}${decimalToHex(b)}`;
  const colorName = getColorName(r, g, b);
  const textColor = getTextColor(r, g, b);

  return {
    success: true,
    data: {
      red: r, green: g, blue: b,
      hex, colorName,
      binary24: `${red} ${green} ${blue}`,
      textColor,
      redBinary: red, greenBinary: green, blueBinary: blue,
      rgb: `rgb(${r}, ${g}, ${b})`,
    },
  };
}

function generateFromName(name) {
  if (!name || typeof name !== 'string') {
    return { success: false, error: 'A color name string is required.' };
  }

  const result = lookupByName(name);

  if (!result) {
    const suggestions = getSuggestions(name);
    const hint = suggestions.length
      ? ` Did you mean: ${suggestions.join(', ')}?`
      : ' Try names like "peach", "cerulean", "burgundy", "sage", "mauve".';
    return {
      success: false,
      error: `Color "${name}" not found in our library.${hint}`,
    };
  }

  const { r, g, b, displayName } = result;
  const redBinary   = r.toString(2).padStart(8, '0');
  const greenBinary = g.toString(2).padStart(8, '0');
  const blueBinary  = b.toString(2).padStart(8, '0');
  const hex         = `#${decimalToHex(r)}${decimalToHex(g)}${decimalToHex(b)}`;
  const textColor   = getTextColor(r, g, b);

  return {
    success: true,
    data: {
      name: displayName,
      red: r, green: g, blue: b,
      redBinary, greenBinary, blueBinary,
      hex,
      binary24: `${redBinary} ${greenBinary} ${blueBinary}`,
      textColor,
      rgb: `rgb(${r}, ${g}, ${b})`,
    },
  };
}

function getAvailableColors() {
  return colorDatabase.map(e => toDisplayName(e.name)).sort();
}

// =============================================================================
module.exports = {
  validateBinaryInput,
  binaryToDecimal,
  decimalToHex,
  getColorName,
  getTextColor,
  generateFromBinary,
  generateFromName,
  getAvailableColors,
};
