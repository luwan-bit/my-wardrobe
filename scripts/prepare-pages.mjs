import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(root, "..");
const openNext = path.join(projectRoot, ".open-next");
const out = path.join(projectRoot, "pages-out");

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}
function mkdirp(p) {
  fs.mkdirSync(p, { recursive: true });
}
function copyRecursive(src, dest) {
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    mkdirp(dest);
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    mkdirp(path.dirname(dest));
    fs.copyFileSync(src, dest);
  }
}

if (!fs.existsSync(path.join(openNext, "worker.js"))) {
  console.error("Missing .open-next/worker.js — run opennextjs-cloudflare build first");
  process.exit(1);
}

rmrf(out);
mkdirp(out);

fs.copyFileSync(path.join(openNext, "worker.js"), path.join(out, "_worker.js"));

for (const dir of ["cloudflare", "middleware", "server-functions", ".build", "dynamodb-provider", "cache", "cloudflare-templates"]) {
  const src = path.join(openNext, dir);
  if (fs.existsSync(src)) copyRecursive(src, path.join(out, dir));
}

copyRecursive(path.join(openNext, "assets"), out);

fs.writeFileSync(
  path.join(out, "_routes.json"),
  JSON.stringify({
    version: 1,
    include: ["/*"],
    exclude: [
      "/_next/static/*",
      "/favicon.ico",
      "/favicon-16.png",
      "/favicon-32.png",
      "/apple-touch-icon.png",
      "/icon-192.png",
      "/icon-512.png",
      "/site.webmanifest",
    ],
  })
);

console.log("Prepared pages-out for Cloudflare Pages deploy");
