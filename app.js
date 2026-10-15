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

// REDIRECT /dashboard → / (no standalone dashboard page exists)
app.get("/dashboard", (req, res) => res.redirect("/"));

// FALLBACK FOR UNDEFINED ROUTES
app.use((req, res) => {
  res.status(404).render("pages/404", {
    title: "404 Not Found | Binary Color Generator",
    activePage: "home",
  });
});

// START SERVER
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}

    Press Ctrl+C to stop the server.
  `);
  });
}

module.exports = app;
