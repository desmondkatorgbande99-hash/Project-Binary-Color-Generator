const express = require('express');
const router = express.Router();


//  EXACT COLOR NAME TABLE
const exactColors = {
  '255,0,0': 'Red', '0,255,0': 'Green', '0,0,255': 'Blue',
  '255,255,0': 'Yellow', '0,255,255': 'Cyan', '255,0,255': 'Magenta',
  '0,0,0': 'Black', '255,255,255': 'White', '128,0,0': 'Maroon',
  '128,128,0': 'Olive', '0,128,128': 'Teal', '0,0,128': 'Navy',
  '128,0,128': 'Purple', '255,165,0': 'Orange', '255,192,203': 'Pink',
  '210,105,30': 'Chocolate', '255,215,0': 'Gold', '192,192,192': 'Silver',
  '128,128,128': 'Gray', '169,169,169': 'Dark Gray', '211,211,211': 'Light Gray',
  '245,245,220': 'Beige', '255,228,181': 'Moccasin', '173,216,230': 'Light Blue',
  '135,206,235': 'Sky Blue', '75,0,130': 'Indigo', '238,130,238': 'Violet',
  '60,179,113': 'Medium Sea Green', '255,20,147': 'Deep Pink', '255,69,0': 'Orange Red',
  '154,205,50': 'Yellow Green', '255,105,180': 'Hot Pink', '0,255,127': 'Spring Green',
  '0,100,0': 'Dark Green', '50,205,50': 'Lime Green', '34,139,34': 'Forest Green',
  '46,139,87': 'Sea Green', '0,0,139': 'Dark Blue', '0,0,205': 'Medium Blue',
  '65,105,225': 'Royal Blue', '70,130,180': 'Steel Blue', '30,144,255': 'Dodger Blue',
  '0,191,255': 'Deep Sky Blue', '100,149,237': 'Cornflower Blue', '139,0,0': 'Dark Red',
  '220,20,60': 'Crimson', '255,99,71': 'Tomato', '255,127,80': 'Coral',
  '255,140,0': 'Dark Orange', '218,165,32': 'Goldenrod', '255,255,224': 'Light Yellow',
  '240,230,140': 'Khaki', '147,112,219': 'Medium Purple', '138,43,226': 'Blue Violet',
  '148,0,211': 'Dark Violet', '139,0,139': 'Dark Magenta', '199,21,133': 'Medium Violet Red',
  '219,112,147': 'Pale Violet Red', '255,182,193': 'Light Pink', '123,104,238': 'Medium Slate Blue',
  '106,90,205': 'Slate Blue', '72,61,139': 'Dark Slate Blue', '173,255,47': 'Green Yellow',
  '127,255,0': 'Chartreuse', '124,252,0': 'Lawn Green', '144,238,144': 'Light Green',
  '152,251,152': 'Pale Green', '143,188,143': 'Dark Sea Green', '0,250,154': 'Medium Spring Green',
  '102,205,170': 'Medium Aquamarine', '127,255,212': 'Aquamarine', '32,178,170': 'Light Sea Green',
  '0,139,139': 'Dark Cyan', '95,158,160': 'Cadet Blue', '176,224,230': 'Powder Blue',
  '135,206,250': 'Light Sky Blue', '240,248,255': 'Alice Blue', '248,248,255': 'Ghost White',
  '245,255,250': 'Mint Cream', '240,255,255': 'Azure', '230,230,250': 'Lavender',
  '216,191,216': 'Thistle', '221,160,221': 'Plum', '218,112,214': 'Orchid',
  '186,85,211': 'Medium Orchid', '153,50,204': 'Dark Orchid', '255,240,245': 'Lavender Blush',
  '255,228,225': 'Misty Rose', '250,235,215': 'Antique White', '250,240,230': 'Linen',
  '253,245,230': 'Old Lace', '255,255,240': 'Ivory', '240,255,240': 'Honeydew',
  '255,245,238': 'Seashell', '255,250,250': 'Snow', '255,250,240': 'Floral White',
  '245,245,245': 'White Smoke', '220,220,220': 'Gainsboro', '105,105,105': 'Dim Gray',
  '119,136,153': 'Light Slate Gray', '112,128,144': 'Slate Gray', '47,79,79': 'Dark Slate Gray',
  '165,42,42': 'Brown', '160,82,45': 'Sienna', '139,69,19': 'Saddle Brown',
  '244,164,96': 'Sandy Brown', '222,184,135': 'Burlywood', '245,222,179': 'Wheat',
  '210,180,140': 'Tan', '188,143,143': 'Rosy Brown', '250,128,114': 'Salmon',
  '255,160,122': 'Light Salmon', '233,150,122': 'Dark Salmon', '240,128,128': 'Light Coral',
  '205,92,92': 'Indian Red', '178,34,34': 'Firebrick', '205,133,63': 'Peru',
  '184,134,11': 'Dark Goldenrod', '238,232,170': 'Pale Goldenrod', '255,248,220': 'Cornsilk',
  '255,250,205': 'Lemon Chiffon', '250,250,210': 'Light Goldenrod Yellow', '255,239,213': 'Papaya Whip',
  '255,218,185': 'Peach Puff', '175,238,238': 'Pale Turquoise', '64,224,208': 'Turquoise',
  '72,209,204': 'Medium Turquoise', '0,206,209': 'Dark Turquoise', '224,255,255': 'Light Cyan',
  '189,183,107': 'Dark Khaki', '107,142,35': 'Olive Drab', '85,107,47': 'Dark Olive Green',
  '25,25,112': 'Midnight Blue', '255,228,196': 'Bisque', '255,235,205': 'Blanched Almond',
  '255,222,173': 'Navajo White', '176,196,222': 'Light Steel Blue',
};

// COLOR NAME → RGB MAP
const colorNameMap = {
  red: [255,0,0], green: [0,255,0], lime: [0,255,0], blue: [0,0,255],
  yellow: [255,255,0], cyan: [0,255,255], aqua: [0,255,255],
  magenta: [255,0,255], fuchsia: [255,0,255], black: [0,0,0], white: [255,255,255],
  maroon: [128,0,0], olive: [128,128,0], teal: [0,128,128], navy: [0,0,128],
  purple: [128,0,128], orange: [255,165,0], pink: [255,192,203],
  chocolate: [210,105,30], gold: [255,215,0], silver: [192,192,192],
  gray: [128,128,128], grey: [128,128,128],
  'dark gray': [169,169,169], 'dark grey': [169,169,169],
  'light gray': [211,211,211], 'light grey': [211,211,211],
  beige: [245,245,220], moccasin: [255,228,181],
  'light blue': [173,216,230], 'sky blue': [135,206,235],
  indigo: [75,0,130], violet: [238,130,238],
  'medium sea green': [60,179,113], 'deep pink': [255,20,147],
  'orange red': [255,69,0], 'yellow green': [154,205,50],
  'hot pink': [255,105,180], 'spring green': [0,255,127],
  'dark green': [0,100,0], 'lime green': [50,205,50],
  'forest green': [34,139,34], 'sea green': [46,139,87],
  'dark blue': [0,0,139], 'medium blue': [0,0,205],
  'royal blue': [65,105,225], 'steel blue': [70,130,180],
  'dodger blue': [30,144,255], 'deep sky blue': [0,191,255],
  'cornflower blue': [100,149,237], 'dark red': [139,0,0],
  crimson: [220,20,60], tomato: [255,99,71], coral: [255,127,80],
  'dark orange': [255,140,0], goldenrod: [218,165,32],
  'light yellow': [255,255,224], khaki: [240,230,140],
  'medium purple': [147,112,219], 'blue violet': [138,43,226],
  'dark violet': [148,0,211], 'dark magenta': [139,0,139],
  'medium violet red': [199,21,133], 'pale violet red': [219,112,147],
  'light pink': [255,182,193], 'medium slate blue': [123,104,238],
  'slate blue': [106,90,205], 'dark slate blue': [72,61,139],
  'green yellow': [173,255,47], chartreuse: [127,255,0],
  'lawn green': [124,252,0], 'light green': [144,238,144],
  'pale green': [152,251,152], 'dark sea green': [143,188,143],
  'medium spring green': [0,250,154], 'medium aquamarine': [102,205,170],
  aquamarine: [127,255,212], 'light sea green': [32,178,170],
  'dark cyan': [0,139,139], 'cadet blue': [95,158,160],
  'powder blue': [176,224,230], 'light sky blue': [135,206,250],
  'alice blue': [240,248,255], 'ghost white': [248,248,255],
  'mint cream': [245,255,250], azure: [240,255,255], lavender: [230,230,250],
  thistle: [216,191,216], plum: [221,160,221], orchid: [218,112,214],
  'medium orchid': [186,85,211], 'dark orchid': [153,50,204],
  'lavender blush': [255,240,245], 'misty rose': [255,228,225],
  'antique white': [250,235,215], linen: [250,240,230], 'old lace': [253,245,230],
  ivory: [255,255,240], honeydew: [240,255,240], seashell: [255,245,238],
  'sea shell': [255,245,238], snow: [255,250,250], 'floral white': [255,250,240],
  'white smoke': [245,245,245], gainsboro: [220,220,220],
  'dim gray': [105,105,105], 'dim grey': [105,105,105],
  'light slate gray': [119,136,153], 'light slate grey': [119,136,153],
  'slate gray': [112,128,144], 'slate grey': [112,128,144],
  'dark slate gray': [47,79,79], 'dark slate grey': [47,79,79],
  brown: [165,42,42], sienna: [160,82,45], 'saddle brown': [139,69,19],
  'sandy brown': [244,164,96], burlywood: [222,184,135], wheat: [245,222,179],
  tan: [210,180,140], 'rosy brown': [188,143,143], salmon: [250,128,114],
  'light salmon': [255,160,122], 'dark salmon': [233,150,122],
  'light coral': [240,128,128], 'indian red': [205,92,92], firebrick: [178,34,34],
  peru: [205,133,63], 'dark goldenrod': [184,134,11], 'pale goldenrod': [238,232,170],
  cornsilk: [255,248,220], 'corn silk': [255,248,220], 'lemon chiffon': [255,250,205],
  'light goldenrod yellow': [250,250,210], 'papaya whip': [255,239,213],
  'peach puff': [255,218,185], 'pale turquoise': [175,238,238],
  turquoise: [64,224,208], 'medium turquoise': [72,209,204],
  'dark turquoise': [0,206,209], 'light cyan': [224,255,255],
  'dark khaki': [189,183,107], 'olive drab': [107,142,35],
  'dark olive green': [85,107,47], 'midnight blue': [25,25,112],
  bisque: [255,228,196], 'blanched almond': [255,235,205],
  'navajo white': [255,222,173], 'light steel blue': [176,196,222],
};


//  UTILITY FUNCTIONS (server-side)

function validateBinaryInput(s) {
  return typeof s === 'string' && /^[01]{8}$/.test(s);
}

function binaryToDecimal(bin) {
  let val = 0;
  for (const ch of bin) val = val * 2 + Number(ch);
  return val;
}

function decimalToHex(dec) {
  return dec.toString(16).toUpperCase().padStart(2, '0');
}

function getColorName(r, g, b) {
  const key = `${r},${g},${b}`;
  if (exactColors[key]) return exactColors[key];

  if (r === g && g === b) {
    if (r === 0) return 'Black';
    if (r === 255) return 'White';
    if (r < 85) return 'Dark Gray';
    if (r < 170) return 'Gray';
    return 'Light Gray';
  }

  let closest = 'Custom Color';
  let minDist = Infinity;
  for (const colorKey in exactColors) {
    const [cr, cg, cb] = colorKey.split(',').map(Number);
    const dist = Math.hypot(r - cr, g - cg, b - cb);
    if (dist < minDist) { minDist = dist; closest = exactColors[colorKey]; }
  }
  return closest;
}


//  ROUTES
/**
 * POST /api/generate-color
 * Body: { red: "11111111", green: "00000000", blue: "00000000" }
 * Returns full color data: decimals, hex, binary24, colorName
 */
router.post('/generate-color', (req, res) => {
  const { red, green, blue } = req.body;

  if (!validateBinaryInput(red) || !validateBinaryInput(green) || !validateBinaryInput(blue)) {
    return res.status(400).json({
      error: 'Invalid input. Each channel must be exactly 8 bits (0s and 1s only).',
    });
  }

  const r = binaryToDecimal(red);
  const g = binaryToDecimal(green);
  const b = binaryToDecimal(blue);
  const hex = `#${decimalToHex(r)}${decimalToHex(g)}${decimalToHex(b)}`;
  const colorName = getColorName(r, g, b);
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return res.json({
    red: r,
    green: g,
    blue: b,
    hex,
    colorName,
    binary24: `${red} ${green} ${blue}`,
    textColor: brightness > 0.5 ? '#000000' : '#ffffff',
  });
});

/**
 * POST /api/color-from-name
 * Body: { name: "coral" }
 * Returns binary strings and full color data for the named color
 */
router.post('/color-from-name', (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'A color name string is required.' });
  }

  const normalized = name.trim().toLowerCase();
  const rgb = colorNameMap[normalized];

  if (!rgb) {
    return res.status(404).json({
      error: `Color name "${name}" not recognised. Try names like 'red', 'coral', 'navy'.`,
    });
  }

  const [r, g, b] = rgb;
  const redBin   = r.toString(2).padStart(8, '0');
  const greenBin = g.toString(2).padStart(8, '0');
  const blueBin  = b.toString(2).padStart(8, '0');
  const hex = `#${decimalToHex(r)}${decimalToHex(g)}${decimalToHex(b)}`;
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return res.json({
    name: normalized.replace(/\b\w/g, (l) => l.toUpperCase()),
    red: r, green: g, blue: b,
    redBinary: redBin, greenBinary: greenBin, blueBinary: blueBin,
    hex,
    binary24: `${redBin} ${greenBin} ${blueBin}`,
    textColor: brightness > 0.5 ? '#000000' : '#ffffff',
  });
});

/**
 * GET /api/health
 * Simple health-check endpoint
 */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Binary Color Generator API is running.' });
});

module.exports = router;