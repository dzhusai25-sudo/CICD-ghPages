const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//import { fileURLToPath } from "node:url";

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 9001,
  },
   plugins: [new HtmlWebpackPlugin()],
};