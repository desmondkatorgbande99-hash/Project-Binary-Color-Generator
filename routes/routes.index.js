const express = require('express');
const { getHomePage, getGeneratorPage, getAboutPage, getDashboardPage } = require('../controllers/controller');

const router = express.Router();

// PAGE ROUTES
router.get('/', getHomePage);
router.get('/dashboard', getDashboardPage);
router.get('/generator', getGeneratorPage);
router.get('/about', getAboutPage);

module.exports = router;
