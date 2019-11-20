const path = require("path");

module.exports = {
    mode: "development",
    entry: path.join(__dirname, "src", "index.js"),
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        compress: true,
        port: 8080
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: "build.js"
    }
}