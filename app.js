const express = require("express");
const indexRoutes = require("./routes/routes.index.js");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const colorAPI = require("./routes/colorAPI");
const app = express();
const PORT = process.env.PORT || 4300;

// VIEW ENGINE SETUP
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layout/dashboard");
app.use(expressLayouts);

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// MAKE CURRENT YEAR AVAILABLE IN ALL TEMPLATES
app.use((req, res, next) => {
  res.locals.currentYear = new Date().getFullYear();
  next();
});

// API & PAGE ROUTES
app.use("/api", colorAPI);
app.use("/", indexRoutes);

// FALLBACK FOR UNDEFINED ROUTES
app.use((req, res) => {
  res.status(404).render("pages/404", {
    title: "404 Not Found | Binary Color Generator",
    activePage: "home",
    error: "The page you are looking for does not exist.",
    colorData: null,
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}!
    URL: http://localhost:${PORT}
Dashboard:http://localhost:${PORT}/dashboard
Generator:http://localhost:${PORT}/generator
About:http://localhost:${PORT}/about
API: http://localhost:${PORT}/api/health

    Press Ctrl+C to stop the server.
  `);
});
