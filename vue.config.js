const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/dolmengi-boss-party",
  outputDir: path.resolve(__dirname, "docs"),
});
