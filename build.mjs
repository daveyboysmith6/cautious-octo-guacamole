import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "build");
const pages = [
  "index.html",
  "departments.html",
  "experience.html",
  "gallery.html",
  "faq.html",
  "callsign.html",
];
const rootFiles = [
  ...pages,
  "styles.css",
  "polish-v14.css",
  "app.js",
  "gallery.js",
  "callsign.js",
  "callsign-core.js",
  "callsign-data.json",
  "robots.txt",
];

const refs = [];
const external = /^(?:https?:|mailto:|data:|javascript:|fivem:|#)/i;
function addHtmlRefs(file) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  for (const match of text.matchAll(/(?:src|href|poster)=["']([^"']+)["']/gi)) {
    const value = match[1].split("?")[0].split("#")[0];
    if (value && !external.test(value)) refs.push([file, value]);
  }
}

function addCssRefs(file) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  for (const match of text.matchAll(/url\(["']?([^)"']+)/gi)) {
    const value = match[1].split("?")[0].split("#")[0];
    if (value && !external.test(value)) refs.push([file, value]);
  }
}

for (const file of rootFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    throw new Error(`Missing required file: ${file}`);
  }
}

for (const page of pages) addHtmlRefs(page);
addCssRefs("styles.css");
addCssRefs("polish-v14.css");
const missing = [];
for (const [source, value] of refs) {
  const resolved = path.resolve(path.dirname(path.join(root, source)), decodeURIComponent(value));
  if (!fs.existsSync(resolved)) missing.push(`${source} -> ${value}`);
}

if (missing.length) {
  throw new Error(`Missing local references:\n${missing.join("\n")}`);
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const file of rootFiles) {
  fs.copyFileSync(path.join(root, file), path.join(out, file));
}
fs.cpSync(path.join(root, "assets"), path.join(out, "assets"), { recursive: true });

console.log(`Validated ${pages.length} pages and ${refs.length} local references.`);
console.log(`Build complete: ${out}`);
