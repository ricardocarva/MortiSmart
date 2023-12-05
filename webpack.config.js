const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: {
        main: "./public/scripts/scripts.js",
        login: "./public/scripts/login.js",
    },
    output: {
        filename: "[name].bundle.min.js", // Output file name
        path: path.resolve(__dirname, "./public/scripts"), // Output directory
    },
    optimization: {
        minimizer: [new TerserPlugin()], // Minify your code
    },
    /* devtool: "source-map", */
};
