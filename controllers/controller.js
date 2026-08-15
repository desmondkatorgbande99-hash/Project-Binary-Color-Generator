// controllers/colorController.js
// Handles HTTP requests and responses for the Binary Color Generator

const path = require("path");
const colorService = require("../services/colorService");

// ============ PAGE ROUTE HANDLERS ============

/**
 * Render the home page
 */
function getHomePage(req, res) {
  res.render("pages/home", {
    title: "Home | Binary Color Generator",
    activePage: "home",
  });
}

/**
 * Render the color generator page (embeds the existing public/index.html functionality)
 */
function getGeneratorPage(req, res) {
  res.render("pages/color-generator", {
    title: "Color Generator | Binary Color Generator",
    activePage: "generator",
  });
}

/**
 * Render the about page
 */
function getAboutPage(req, res) {
  res.render("pages/about", {
    title: "About | Binary Color Generator",
    activePage: "about",
  });
}

function getDashboardPage(req, res) {
  res.render("pages/home", {
    title: "Dashboard | Binary Color Generator",
    activePage: "dashboard",
    error: null,
    colorData: null,
  });
}

/**
 * Serve the original standalone app
 */
function getOriginalApp(req, res) {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
}

// ============ API ROUTE HANDLERS ============

/**
 * Generate color from binary input
 * POST /api/generate-color
 * Body: { red: "11111111", green: "00000000", blue: "00000000" }
 */
function generateColorFromBinary(req, res) {
  const { red, green, blue } = req.body;

  // Validate required fields
  if (!red || !green || !blue) {
    return res.status(400).json({
      error: "Missing required fields: red, green, blue are required.",
    });
  }

  const result = colorService.generateFromBinary(red, green, blue);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  return res.json(result.data);
}

/**
 * Generate color from color name
 * POST /api/color-from-name
 * Body: { name: "coral" }
 */
function generateColorFromName(req, res) {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "A color name string is required." });
  }

  const result = colorService.generateFromName(name);

  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }

  return res.json(result.data);
}

/**
 * Health check endpoint
 * GET /api/health
 */
function healthCheck(req, res) {
  res.json({
    status: "ok",
    message: "Binary Color Generator API is running.",
    timestamp: new Date().toISOString(),
    endpoints: {
      generateColor: "POST /api/generate-color",
      generateFromName: "POST /api/color-from-name",
      health: "GET /api/health",
    },
  });
}

/**
 * Get available color names list
 * GET /api/colors
 */
function getColorList(req, res) {
  const colors = colorService.getAvailableColors();
  res.json({
    count: colors.length,
    colors: colors,
  });
}

module.exports = {
  // Page handlers
  getHomePage,
  getGeneratorPage,
  getAboutPage,
  getDashboardPage,
  getOriginalApp,
  // API handlers
  generateColorFromBinary,
  generateColorFromName,
  healthCheck,
  getColorList,
};
