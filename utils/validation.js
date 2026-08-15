// utils/validation.js
// Binary input validation utilities with caching for performance

// Cache for validation results
const validationCache = new Map();

// Cache for sanitized inputs
const sanitizeCache = new Map();

// Cache for padded binary strings
const padCache = new Map();

/**
 * Validates if a string contains exactly 8 binary digits (0 or 1)
 * @param {string} inputString - The string to validate
 * @returns {boolean} - True if valid 8-bit binary string
 */
function validateBinaryInput(inputString) {
    // Check cache first
    if (validationCache.has(inputString)) {
        return validationCache.get(inputString);
    }
    
    let isValid = false;
    
    if (typeof inputString === 'string' && inputString.length === 8) {
        isValid = /^[01]{8}$/.test(inputString);
    }
    
    // Store in cache
    validationCache.set(inputString, isValid);
    return isValid;
}

/**
 * Quick validation for partial input (used during typing)
 * @param {string} inputString - Partial input to check
 * @returns {boolean} - True if input contains only 0s and 1s (any length up to 8)
 */
function quickValidateBinary(inputString) {
    if (!inputString || typeof inputString !== 'string') return false;
    if (inputString.length > 8) return false;
    return /^[01]*$/.test(inputString);
}

/**
 * Sanitizes binary input by removing non-binary characters
 * @param {string} input - Raw input string
 * @returns {string} - Sanitized string containing only 0s and 1s (max 8 chars)
 */
function sanitizeBinary(input) {
    if (!input || typeof input !== 'string') return '';
    
    // Check cache
    if (sanitizeCache.has(input)) {
        return sanitizeCache.get(input);
    }
    
    const sanitized = input.replace(/[^01]/g, '').slice(0, 8);
    sanitizeCache.set(input, sanitized);
    return sanitized;
}

/**
 * Ensures binary string is exactly 8 bits by padding with leading zeros
 * @param {string} binaryString - Binary string to pad
 * @returns {string} - 8-bit padded binary string
 */
function padTo8Bits(binaryString) {
    if (!binaryString) return '00000000';
    
    // Check cache
    if (padCache.has(binaryString)) {
        return padCache.get(binaryString);
    }
    
    const sanitized = sanitizeBinary(binaryString);
    const padded = sanitized.padStart(8, '0');
    
    padCache.set(binaryString, padded);
    return padded;
}

/**
 * Checks if input is a valid color name format
 * @param {string} input - Color name to validate
 * @returns {boolean} - True if non-empty string
 */
function isValidColorName(input) {
    return typeof input === 'string' && input.trim().length > 0 && input.trim().length <= 50;
}

/**
 * Normalizes color name (trim, lowercase)
 * @param {string} input - Raw color name
 * @returns {string} - Normalized color name
 */
function normalizeColorName(input) {
    if (!input || typeof input !== 'string') return '';
    return input.trim().toLowerCase();
}

/**
 * Clears all validation caches (useful for memory management)
 */
function clearValidationCaches() {
    validationCache.clear();
    sanitizeCache.clear();
    padCache.clear();
}

/**
 * Gets cache statistics for debugging
 * @returns {Object} - Cache sizes
 */
function getCacheStats() {
    return {
        validationCache: validationCache.size,
        sanitizeCache: sanitizeCache.size,
        padCache: padCache.size
    };
}

module.exports = {
    // Main validation functions
    validateBinaryInput,
    quickValidateBinary,
    sanitizeBinary,
    padTo8Bits,
    // Color name validation
    isValidColorName,
    normalizeColorName,
    // Cache management
    clearValidationCaches,
    getCacheStats
};