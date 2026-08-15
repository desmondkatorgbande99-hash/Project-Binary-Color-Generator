exports.getHomePage = (req, res) => {
    res.render("pages/home", {
        title: "Home | Binary Color Generator" });
}

exports.getGeneratorPage = (req, res) => {
    res.render("pages/generator", {
        title: "Color Generator | Binary Color Generator" });
}

exports.getAboutPage = (req, res) => {
    res.render("pages/about", {
        title: "About | Binary Color Generator" });
}   