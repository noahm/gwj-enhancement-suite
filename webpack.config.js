module.exports = {
    entry: {
        content_scripts: "./content_scripts/index.js",
        settings: "./settings/index.js"
    },
    output: {
        path: "addon",
        filename: "[name]/index.js"
    },
    watch: true
};
