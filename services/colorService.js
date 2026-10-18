// ============ COLOR DATABASES ============

/**
 * Exact color name mappings (RGB key -> color name)
 */
const exactColors = {
    // Primary
    '255,0,0': 'Red', '0,255,0': 'Green', '0,0,255': 'Blue',
    // Secondary
    '255,255,0': 'Yellow', '0,255,255': 'Cyan', '255,0,255': 'Magenta',
    // Grayscale
    '0,0,0': 'Black', '255,255,255': 'White',
    // Basic colors
    '128,0,0': 'Maroon', '128,128,0': 'Olive', '0,128,128': 'Teal',
    '0,0,128': 'Navy', '128,0,128': 'Purple', '255,165,0': 'Orange',
    '255,192,203': 'Pink', '210,105,30': 'Chocolate', '255,215,0': 'Gold',
    '192,192,192': 'Silver', '128,128,128': 'Gray', '169,169,169': 'Dark Gray',
    '211,211,211': 'Light Gray', '245,245,220': 'Beige', '255,228,181': 'Moccasin',
    // Blues
    '173,216,230': 'Light Blue', '135,206,235': 'Sky Blue', '75,0,130': 'Indigo',
    '238,130,238': 'Violet',
    // Greens
    '60,179,113': 'Medium Sea Green', '0,100,0': 'Dark Green', '50,205,50': 'Lime Green',
    '34,139,34': 'Forest Green', '46,139,87': 'Sea Green',
    // Reds
    '139,0,0': 'Dark Red', '220,20,60': 'Crimson', '255,99,71': 'Tomato',
    '255,127,80': 'Coral',
    // Purples
    '147,112,219': 'Medium Purple', '138,43,226': 'Blue Violet', '148,0,211': 'Dark Violet',
    '139,0,139': 'Dark Magenta',
    // Others
    '255,140,0': 'Dark Orange', '218,165,32': 'Goldenrod', '255,255,224': 'Light Yellow',
    '240,230,140': 'Khaki', '255,182,193': 'Light Pink', '123,104,238': 'Medium Slate Blue',
    '106,90,205': 'Slate Blue', '72,61,139': 'Dark Slate Blue',
    // Browns
    '165,42,42': 'Brown', '160,82,45': 'Sienna', '139,69,19': 'Saddle Brown',
    '244,164,96': 'Sandy Brown', '222,184,135': 'Burlywood', '245,222,179': 'Wheat',
    '210,180,140': 'Tan', '188,143,143': 'Rosy Brown', '250,128,114': 'Salmon',
    // Light colors
    '240,248,255': 'Alice Blue', '248,248,255': 'Ghost White', '245,255,250': 'Mint Cream',
    '240,255,255': 'Azure', '230,230,250': 'Lavender', '255,240,245': 'Lavender Blush',
    '255,228,225': 'Misty Rose', '250,235,215': 'Antique White', '250,240,230': 'Linen',
    '253,245,230': 'Old Lace', '255,255,240': 'Ivory', '240,255,240': 'Honeydew',
    '255,245,238': 'Seashell', '255,250,250': 'Snow', '255,250,240': 'Floral White',
    '245,245,245': 'White Smoke', '220,220,220': 'Gainsboro'
};

/**
 * Color name to RGB mapping (case-insensitive)
 */
const colorNameMap = {
    // Primary
    'red': [255, 0, 0], 'green': [0, 255, 0], 'lime': [0, 255, 0],
    'blue': [0, 0, 255], 'yellow': [255, 255, 0], 'cyan': [0, 255, 255],
    'aqua': [0, 255, 255], 'magenta': [255, 0, 255], 'fuchsia': [255, 0, 255],
    // Grayscale
    'black': [0, 0, 0], 'white': [255, 255, 255], 'gray': [128, 128, 128],
    'grey': [128, 128, 128], 'dark gray': [169, 169, 169], 'dark grey': [169, 169, 169],
    'light gray': [211, 211, 211], 'light grey': [211, 211, 211],
    // Basic
    'maroon': [128, 0, 0], 'olive': [128, 128, 0], 'teal': [0, 128, 128],
    'navy': [0, 0, 128], 'purple': [128, 0, 128], 'orange': [255, 165, 0],
    'pink': [255, 192, 203], 'chocolate': [210, 105, 30], 'gold': [255, 215, 0],
    'silver': [192, 192, 192], 'beige': [245, 245, 220], 'moccasin': [255, 228, 181],
    // Blues
    'light blue': [173, 216, 230], 'sky blue': [135, 206, 235], 'indigo': [75, 0, 130],
    'violet': [238, 130, 238], 'navy blue': [0, 0, 128], 'royal blue': [65, 105, 225],
    'steel blue': [70, 130, 180], 'dodger blue': [30, 144, 255], 'deep sky blue': [0, 191, 255],
    'cornflower blue': [100, 149, 237],
    // Greens
    'dark green': [0, 100, 0], 'lime green': [50, 205, 50], 'forest green': [34, 139, 34],
    'sea green': [46, 139, 87], 'medium sea green': [60, 179, 113],
    // Reds/Pinks
    'dark red': [139, 0, 0], 'crimson': [220, 20, 60], 'tomato': [255, 99, 71],
    'coral': [255, 127, 80], 'hot pink': [255, 105, 180], 'deep pink': [255, 20, 147],
    'light pink': [255, 182, 193],
    // Purples
    'medium purple': [147, 112, 219], 'blue violet': [138, 43, 226], 'dark violet': [148, 0, 211],
    'dark magenta': [139, 0, 139], 'medium violet red': [199, 21, 133], 'pale violet red': [219, 112, 147],
    // Yellows/Golds
    'dark orange': [255, 140, 0], 'goldenrod': [218, 165, 32], 'light yellow': [255, 255, 224],
    'khaki': [240, 230, 140],
    // Browns
    'brown': [165, 42, 42], 'sienna': [160, 82, 45], 'saddle brown': [139, 69, 19],
    'sandy brown': [244, 164, 96], 'burlywood': [222, 184, 135], 'wheat': [245, 222, 179],
    'tan': [210, 180, 140], 'rosy brown': [188, 143, 143], 'salmon': [250, 128, 114],
    'light salmon': [255, 160, 122], 'dark salmon': [233, 150, 122], 'light coral': [240, 128, 128],
    'indian red': [205, 92, 92], 'firebrick': [178, 34, 34], 'peru': [205, 133, 63],
    // Light neutrals
    'alice blue': [240, 248, 255], 'ghost white': [248, 248, 255], 'mint cream': [245, 255, 250],
    'azure': [240, 255, 255], 'lavender': [230, 230, 250], 'lavender blush': [255, 240, 245],
    'misty rose': [255, 228, 225], 'antique white': [250, 235, 215], 'linen': [250, 240, 230],
    'old lace': [253, 245, 230], 'ivory': [255, 255, 240], 'honeydew': [240, 255, 240],
    'seashell': [255, 245, 238], 'snow': [255, 250, 250], 'floral white': [255, 250, 240],
    'white smoke': [245, 245, 245], 'gainsboro': [220, 220, 220]
};

// ============ CACHE FOR PERFORMANCE ============

const binaryToDecimalCache = new Map();
const decimalToHexCache = new Map();

// ============ UTILITY FUNCTIONS ============

/**
 * Validate 8-bit binary string
 * @param {string} s - Binary string to validate
 * @returns {boolean} - True if valid 8-bit binary
 */
function validateBinaryInput(s) {
    return typeof s === 'string' && /^[01]{8}$/.test(s);
}

/**
 * Convert binary string to decimal
 * @param {string} bin - 8-bit binary string
 * @returns {number} - Decimal value (0-255)
 */
function binaryToDecimal(bin) {
    if (binaryToDecimalCache.has(bin)) {
        return binaryToDecimalCache.get(bin);
    }
    
    let val = 0;
    for (const ch of bin) {
        val = val * 2 + Number(ch);
    }
    
    binaryToDecimalCache.set(bin, val);
    return val;
}

/**
 * Convert decimal to 2-digit hex
 * @param {number} dec - Decimal value (0-255)
 * @returns {string} - 2-digit hex string
 */
function decimalToHex(dec) {
    if (decimalToHexCache.has(dec)) {
        return decimalToHexCache.get(dec);
    }
    
    const hex = dec.toString(16).toUpperCase().padStart(2, '0');
    decimalToHexCache.set(dec, hex);
    return hex;
}

/**
 * Get color name from RGB values
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} - Color name
 */
function getColorName(r, g, b) {
    const key = `${r},${g},${b}`;
    
    // Exact match
    if (exactColors[key]) {
        return exactColors[key];
    }
    
    // Grayscale detection
    if (r === g && g === b) {
        if (r === 0) return 'Black';
        if (r === 255) return 'White';
        if (r < 85) return 'Dark Gray';
        if (r < 170) return 'Gray';
        return 'Light Gray';
    }
    
    // Find closest match
    let closest = 'Custom Color';
    let minDist = Infinity;
    
    for (const colorKey in exactColors) {
        const [cr, cg, cb] = colorKey.split(',').map(Number);
        const dist = Math.hypot(r - cr, g - cg, b - cb);
        
        if (dist < minDist) {
            minDist = dist;
            closest = exactColors[colorKey];
        }
    }
    
    return closest;
}

/**
 * Calculate text color based on background brightness
 * @param {number} r - Red value
 * @param {number} g - Green value
 * @param {number} b - Blue value
 * @returns {string} - '#000000' or '#ffffff'
 */
function getTextColor(r, g, b) {
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return brightness > 0.5 ? '#000000' : '#ffffff';
}

// ============ MAIN BUSINESS LOGIC ============

/**
 * Generate color data from binary input
 * @param {string} red - 8-bit binary for red channel
 * @param {string} green - 8-bit binary for green channel
 * @param {string} blue - 8-bit binary for blue channel
 * @returns {Object} - { success, data/error }
 */
function generateFromBinary(red, green, blue) {
    // Validate input
    if (!validateBinaryInput(red) || !validateBinaryInput(green) || !validateBinaryInput(blue)) {
        return {
            success: false,
            error: 'Invalid input. Each channel must be exactly 8 bits (0s and 1s only).'
        };
    }

    // Convert to decimal
    const r = binaryToDecimal(red);
    const g = binaryToDecimal(green);
    const b = binaryToDecimal(blue);

    // Generate hex and color name
    const hex = `#${decimalToHex(r)}${decimalToHex(g)}${decimalToHex(b)}`;
    const colorName = getColorName(r, g, b);
    const textColor = getTextColor(r, g, b);

    return {
        success: true,
        data: {
            red: r,
            green: g,
            blue: b,
            hex,
            colorName,
            binary24: `${red} ${green} ${blue}`,
            textColor,
            // Include binary strings for convenience
            redBinary: red,
            greenBinary: green,
            blueBinary: blue,
            rgb: `rgb(${r}, ${g}, ${b})`
        }
    };
}

/**
 * Generate color data from color name
 * @param {string} name - Color name (e.g., "red", "green")
 * @returns {Object} - { success, data/error }
 */
function generateFromName(name) {
    const normalized = name.trim().toLowerCase();
    const rgb = colorNameMap[normalized];

    if (!rgb) {
        return {
            success: false,
            error: `Color name "${name}" not recognized. Try names like 'red', 'blue', 'green', 'purple', 'orange', 'pink'.`
        };
    }

    const [r, g, b] = rgb;
    const redBinary = r.toString(2).padStart(8, '0');
    const greenBinary = g.toString(2).padStart(8, '0');
    const blueBinary = b.toString(2).padStart(8, '0');
    const hex = `#${decimalToHex(r)}${decimalToHex(g)}${decimalToHex(b)}`;
    const textColor = getTextColor(r, g, b);

    return {
        success: true,
        data: {
            name: normalized.charAt(0).toUpperCase() + normalized.slice(1),
            red: r,
            green: g,
            blue: b,
            redBinary,
            greenBinary,
            blueBinary,
            hex,
            binary24: `${redBinary} ${greenBinary} ${blueBinary}`,
            textColor,
            rgb: `rgb(${r}, ${g}, ${b})`
        }
    };
}

/**
 * Get list of all available color names
 * @returns {Array} - Array of color names
 */
function getAvailableColors() {
    return Object.keys(colorNameMap).sort();
}

module.exports = {
    // Validation
    validateBinaryInput,
    // Conversion
    binaryToDecimal,
    decimalToHex,
    // Color utilities
    getColorName,
    getTextColor,
    // Main functions
    generateFromBinary,
    generateFromName,
    getAvailableColors,
    // Data exports (for reference)
    exactColors,
    colorNameMap
};