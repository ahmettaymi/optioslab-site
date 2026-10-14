// OptiosLab statik site derleyicisi
// Kullanım: node src/build.mjs [çıktı-dizini]   (varsayılan: repo kökü)
import { mkdirSync, writeFileSync, cpSync, readFileSync, existsSync, rmSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { solutions, sectors, redirects, site } from "./data.mjs";
import * as P from "./pages.mjs";
import { cards, cardPage, vcard } from "./card.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const out = resolve(process.argv[2] || root);
// Önbellek etiketi: her derlemede değişir (aynı gün içindeki yayınlar da ayrışsın)
const version = Date.now().toString(36);

const write = (rel, html) => {
  const file = join(out, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html.replace(/__V__/g, version));
};

// Eski site dosyalarını temizle (yalnızca kök çıktıda ve bilinen klasörler)
const legacy = ["about", "acceptable-use-policy", "boltshift", "case-studies", "clandestine", "commandr", "contact",
  "cookie-policy", "lightspeed", "polymath", "privacy-policy", "terms-conditions", "video-landing", "legal", "404",
  "docs", "scripts", "tests", "assets", "index.html"];
if (out === root) {
  for (const l of legacy) if (existsSync(join(root, l))) rmSync(join(root, l), { recursive: true, force: true });
}

// Statik varlıklar
cpSync(join(here, "assets"), join(out, "assets"), { recursive: true });

// Sayfalar
const pages = [];
const add = (rel, html) => { write(rel, html); pages.push(rel); };

add("index.html", P.home());
add("cozumler/index.html", P.solutionsIndex());
for (const s of solutions) add(`cozumler/${s.slug}/index.html`, P.solutionDetail(s));
add("sektorler/index.html", P.sectorsIndex());
for (const s of sectors) add(`sektorler/${s.slug}/index.html`, P.sectorDetail(s));
add("hakkimizda/index.html", P.about());
add("iletisim/index.html", P.contact());
for (const l of P.legalPages) add(`${l.slug}/index.html`, P.legal(l));
// Dijital kartvizitler (QR hedefi; sitemap dışında, noindex)
for (const c of cards) {
  write(`${c.slug}/index.html`, cardPage(c));
  write(`${c.slug}/${c.slug}.vcf`, vcard(c));
}
write("404/index.html", P.notFound());
write("404.html", P.notFound());

// Eski adresler için yönlendirme stub’ları
for (const [from, to] of Object.entries(redirects)) write(`${from}/index.html`, P.redirectStub(to));

// sitemap + robots
const urls = pages.map((p) => site.domain + "/" + p.replace(/index\.html$/, ""));
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((u) => `  <url><loc>${u}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>`)
  .join("\n")}\n</urlset>\n`);
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${site.domain}/sitemap.xml\n`);

// favicon
write("favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#06130e"/><circle cx="32" cy="32" r="15" fill="none" stroke="#3ddc84" stroke-width="7"/></svg>`);

console.log(`✓ ${pages.length} sayfa + ${Object.keys(redirects).length} yönlendirme → ${out}`);
