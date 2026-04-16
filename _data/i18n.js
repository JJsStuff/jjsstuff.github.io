const fs = require("fs");
const path = require("path");

const localesDir = path.join(__dirname, "..", "locales");
module.exports = {
  de: JSON.parse(fs.readFileSync(path.join(localesDir, "de.json"), "utf-8")),
  en: JSON.parse(fs.readFileSync(path.join(localesDir, "en.json"), "utf-8")),
};
