const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const manifestPath = path.join(root, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const requiredFiles = [
  "background.js",
  "content-script.js",
  "panel/panel.html",
  "panel/panel.css",
  "panel/panel.js",
  "icons/hello.svg"
];
const javascriptFiles = [
  "background.js",
  "content-script.js",
  "panel/panel.js"
];

const failures = [];

if (manifest.manifest_version !== 2) {
  failures.push("manifest_version must be 2 for this Firefox MV2 template.");
}

for (const permission of ["activeTab", "storage"]) {
  if (!manifest.permissions.includes(permission)) {
    failures.push(`Missing permission: ${permission}`);
  }
}

if (!manifest.browser_action || !manifest.browser_action.default_icon) {
  failures.push("Missing browser_action.default_icon.");
}

if (!manifest.sidebar_action || manifest.sidebar_action.default_panel !== "panel/panel.html") {
  failures.push("Missing sidebar_action.default_panel for panel/panel.html.");
}

if (!manifest.background || !manifest.background.scripts.includes("background.js")) {
  failures.push("Missing background.js registration.");
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    failures.push(`Missing file: ${file}`);
  }
}

for (const file of javascriptFiles) {
  const filename = path.join(root, file);

  try {
    new vm.Script(fs.readFileSync(filename, "utf8"), { filename });
  } catch (error) {
    failures.push(`JavaScript syntax error in ${file}: ${error.message}`);
  }
}

if (manifest.web_accessible_resources && manifest.web_accessible_resources.length > 0) {
  failures.push("web_accessible_resources should stay empty unless a page must load extension files.");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Extension scaffold looks good.");
