const express = require('express');
const router = express.Router();
const { generateFromBinary, generateFromName } = require('../services/colorService');


/**
 * POST /api/generate-color
 * Body: { red: "11111111", green: "00000000", blue: "00000000" }
 * Returns full color data: decimals, hex, binary24, colorName
 */
router.post('/generate-color', (req, res) => {
  const { red, green, blue } = req.body;
  const result = generateFromBinary(red, green, blue);
  return result.success
    ? res.json(result.data)
    : res.status(400).json({ error: result.error });
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
  const result = generateFromName(name);
  return result.success
    ? res.json(result.data)
    : res.status(404).json({ error: result.error });
});

/**
 * GET /api/health
 * Simple health-check endpoint
 */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Binary Color Generator API is running.' });
});

module.exports = router;