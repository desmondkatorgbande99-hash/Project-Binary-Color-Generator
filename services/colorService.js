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

// ── LEGIT COLOR LOOKUP ─────────────────────────────────────────────────────────
// Strictly checks for legitimate, existing color names:
// 1. Exact match (case-insensitive, trimmed)
// 2. Formatting variations (e.g., "sky blue" vs "skyblue" vs "sky-blue")
// Does NOT guess random words (e.g. "cat" will NOT match "cyan", "burg" will NOT match).
function lookupByName(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') return null;

  const input   = rawInput.trim().toLowerCase();
  const compact = input.replace(/[\s\-_]+/g, '');

  if (!input || !compact) return null;

  // 1. Exact normalized match (e.g., "peach", "burgundy", "cyan")
  if (exactMap.has(input)) {
    const e = exactMap.get(input);
    return { r: e.r, g: e.g, b: e.b, displayName: toDisplayName(e.name) };
  }

  // 2. Compact match for spacing/hyphen differences (e.g., "sky blue" vs "skyblue" vs "sky-blue")
  if (compactMap.has(compact)) {
    const e = compactMap.get(compact);
    return { r: e.r, g: e.g, b: e.b, displayName: toDisplayName(e.name) };
  }

  // Not a legitimate color name
  return null;
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

  const trimmed = name.trim();
  const result = lookupByName(trimmed);

  if (!result) {
    return {
      success: false,
      error: `"${trimmed}" is not recognized as a legitimate color. Please enter a valid color name (e.g. Peach, Burgundy, Navy, Coral, Cyan).`,
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
