// Dijital kartvizit sayfaları (QR ile açılır). Adres kalıcıdır: basılı QR'lar bu yola bakar.
// Bilgi değişirse yalnızca aşağıdaki kaydı düzenleyin; QR yeniden basılmaz.
import { site } from "./data.mjs";
import { esc } from "./layout.mjs";

export const cards = [
  {
    slug: "ahmet",
    name: "Ahmet Taymi Genel",
    first: "Ahmet Taymi",
    last: "Genel",
    // Rehberde görünen ad: aranınca "Yapay Zeka" ile de bulunsun
    contactLast: "Genel Yapay Zeka",
    title: "Co-Founder",
    org: "OptiosLab",
    phone: "+90 507 271 75 18",
    phoneRaw: "+905072717518",
    whatsapp: "905072717518",
    emailWork: "ahmet@optioslab.com",
    emailPersonal: "selam@ahmettaymi.com",
    webCompany: "https://optioslab.com",
    webPersonal: "https://ahmettaymi.com",
    instagram: "ahmet.taymi",
    photo: "/assets/img/team/ahmet-taymi-genel-avatar.jpg",
    initials: "AT"
  }
];

const ic = {
  phone: `<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>`,
  wa: `<path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.4L3 21z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-1.9-1-1 .8a4 4 0 0 1-2.2-2.2l.8-1-1-1.9L9 9.5z"/>`,
  mail: `<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 6 9 7 9-7"/>`,
  globe: `<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.6 2.8 3.9 6 3.9 9.5s-1.3 6.7-3.9 9.5c-2.6-2.8-3.9-6-3.9-9.5s1.3-6.7 3.9-9.5z"/>`,
  user: `<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>`,
  ig: `<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/>`,
  save: `<path d="M12 4v11M7 10l5 5 5-5"/><path d="M4 19h16"/>`,
  share: `<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>`
};
const svg = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ic[k]}</svg>`;
const host = (u) => u.replace(/^https?:\/\//, "").replace(/\/$/, "");

// vCard 3.0 — iOS ve Android rehberine doğrudan eklenir
export function vcard(c) {
  const v = (s) => String(s).replace(/([,;\\])/g, "\\$1");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${v(c.contactLast || c.last)};${v(c.first)};;;`,
    `FN:${v(`${c.first} ${c.contactLast || c.last}`)}`,
    `ORG:${v(c.org)}`,
    `TITLE:${v(c.title)}`,
    `TEL;TYPE=CELL,VOICE:${c.phoneRaw}`,
    `EMAIL;TYPE=WORK,INTERNET:${c.emailWork}`,
    `EMAIL;TYPE=HOME,INTERNET:${c.emailPersonal}`,
    `URL;TYPE=WORK:${c.webCompany}`,
    `URL;TYPE=HOME:${c.webPersonal}`,
    `X-SOCIALPROFILE;TYPE=instagram:https://instagram.com/${c.instagram}`,
    `NOTE:${v(`Instagram: @${c.instagram}`)}`,
    "END:VCARD",
    ""
  ].join("\r\n");
}

export function cardPage(c) {
  const url = `${site.domain}/${c.slug}/`;
  const vcf = `/${c.slug}/${c.slug}.vcf`;
  const rows = [
    { k: "phone", label: "Telefon", value: c.phone, href: `tel:${c.phoneRaw}` },
    { k: "wa", label: "WhatsApp", value: "Mesaj gönder", href: `https://wa.me/${c.whatsapp}`, ext: true },
    { k: "mail", label: "Kurumsal e-posta", value: c.emailWork, href: `mailto:${c.emailWork}` },
    { k: "mail", label: "Kişisel e-posta", value: c.emailPersonal, href: `mailto:${c.emailPersonal}` },
    { k: "globe", label: "Şirket", value: host(c.webCompany), href: c.webCompany, ext: true },
    { k: "user", label: "Kişisel site", value: host(c.webPersonal), href: c.webPersonal, ext: true },
    { k: "ig", label: "Instagram", value: `@${c.instagram}`, href: `https://instagram.com/${c.instagram}`, ext: true }
  ];
  const t = `${c.name} · ${c.title}, ${c.org}`;
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(t)}</title>
<meta name="description" content="${esc(`${c.name} — ${c.title}, ${c.org}. İletişim bilgileri ve rehbere kaydet.`)}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${url}">
<meta property="og:type" content="profile">
<meta property="og:title" content="${esc(t)}">
<meta property="og:description" content="Dijital kartvizit — tek dokunuşla rehbere kaydedin.">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.domain}${site.ogImage}">
<meta name="theme-color" content="#0d2a1d">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/fonts/fonts.css">
<style>
:root{--bg:#0d2a1d;--bg2:#133a28;--line:rgba(255,255,255,.1);--tx:#f1f6ef;--mut:#b3c9ba;--dim:#7f9c8a;--acc:#3ddc84;--mint:#b6f3cc;--paper:#f5f3ea;--ink:#0b1a13}
*{box-sizing:border-box}
html{background:#071a11}html,body{margin:0;min-height:100%}
body{background:radial-gradient(120% 70% at 50% -10%,#1d5139 0%,var(--bg) 55%,#071a11 100%) no-repeat;min-height:100vh;color:var(--tx);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased;display:flex;justify-content:center;padding:max(28px,env(safe-area-inset-top)) 18px max(28px,env(safe-area-inset-bottom))}
a{color:inherit;text-decoration:none}
.c{width:100%;max-width:440px}
.hero{position:relative;border:1px solid var(--line);border-radius:26px;padding:30px 26px 26px;background:linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,.015));overflow:hidden;box-shadow:0 40px 90px -40px rgba(0,0,0,.75)}
.hero::before{content:"";position:absolute;inset:-40% -30% auto auto;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(61,220,132,.28),transparent 65%);pointer-events:none}
.hero::after{content:"";position:absolute;left:26px;right:26px;bottom:0;height:1px;background:linear-gradient(90deg,transparent,var(--acc),transparent);opacity:.6}
.logo{display:block;height:30px;width:auto}
.mono{display:inline-flex;overflow:hidden;object-fit:cover;border:2px solid rgba(61,220,132,.55);align-items:center;justify-content:center;width:84px;height:84px;border-radius:24px;margin:34px 0 18px;background:linear-gradient(145deg,var(--acc),#157a45);color:#06130e;font:800 24px/1 Manrope,Inter,sans-serif;letter-spacing:-.02em;box-shadow:0 10px 30px -10px rgba(61,220,132,.6)}
h1{margin:0;font:800 30px/1.08 Manrope,Inter,sans-serif;letter-spacing:-.025em}
.role{margin:10px 0 0;color:var(--mut);font-size:15px}
.role b{color:var(--mint);font-weight:600}
.acts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:24px}
.btn{display:flex;align-items:center;justify-content:center;gap:8px;height:50px;border-radius:14px;font:600 15px/1 Inter,sans-serif;border:1px solid var(--line);background:rgba(255,255,255,.05);cursor:pointer;color:var(--tx);-webkit-tap-highlight-color:transparent;transition:transform .15s,background .15s}
.btn:active{transform:scale(.98)}
.btn svg{width:18px;height:18px}
.btn.p{grid-column:1/-1;background:var(--acc);border-color:var(--acc);color:#06130e}
.list{margin-top:14px;border:1px solid var(--line);border-radius:22px;background:rgba(6,19,14,.35);overflow:hidden}
.row{display:flex;align-items:center;gap:14px;padding:15px 18px;border-top:1px solid var(--line);transition:background .15s}
.row:first-child{border-top:0}
.row:hover,.row:active{background:rgba(255,255,255,.04)}
.ico{flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:rgba(61,220,132,.1);color:var(--acc)}
.ico svg{width:19px;height:19px}
.row small{display:block;color:var(--dim);font-size:12px;letter-spacing:.04em;text-transform:uppercase;margin-bottom:3px}
.row div span{display:block;font-size:15.5px;font-weight:500;word-break:break-all}
.row i{margin-left:auto;color:var(--dim);font-style:normal;font-size:18px}
.foot{margin:22px 0 4px;text-align:center;color:var(--dim);font-size:12.5px}
.foot a{color:var(--mut)}
@media (hover:hover){.btn:hover{background:rgba(255,255,255,.09)}.btn.p:hover{background:var(--mint)}}
</style>
</head>
<body>
<main class="c">
  <section class="hero">
    <a href="${site.domain}" aria-label="OptiosLab"><img class="logo" src="/assets/img/optioslablogo-white.png" alt="OptiosLab" width="925" height="260"></a>
    ${c.photo ? `<img class="mono" src="${c.photo}" alt="${esc(c.name)}" width="84" height="84">` : `<div class="mono" aria-hidden="true">${esc(c.initials)}</div>`}
    <h1>${esc(c.name)}</h1>
    <p class="role">${esc(c.title)} · <b>${esc(c.org)}</b></p>
    <div class="acts">
      <a class="btn p" href="${vcf}" download="${esc(`${c.first} ${c.contactLast || c.last}`)}.vcf">${svg("save")} Rehbere kaydet</a>
      <a class="btn" href="tel:${c.phoneRaw}">${svg("phone")} Ara</a>
      <a class="btn" href="https://wa.me/${c.whatsapp}" target="_blank" rel="noopener">${svg("wa")} WhatsApp</a>
    </div>
  </section>
  <nav class="list" aria-label="İletişim">
    ${rows.map((r) => `<a class="row" href="${r.href}"${r.ext ? ' target="_blank" rel="noopener"' : ""}><span class="ico">${svg(r.k)}</span><div><small>${r.label}</small><span>${esc(r.value)}</span></div><i aria-hidden="true">›</i></a>`).join("\n    ")}
  </nav>
  <div class="acts" style="grid-template-columns:1fr;margin-top:14px">
    <button class="btn" type="button" id="share">${svg("share")} Kartı paylaş</button>
  </div>
  <p class="foot"><a href="${site.domain}">optioslab.com</a> · AI destekli iş sistemleri</p>
</main>
<script>
document.getElementById("share").addEventListener("click", async (ev) => {
  const b = ev.currentTarget;
  const d = { title: ${JSON.stringify(c.name)}, text: ${JSON.stringify(`${c.name} · ${c.title}, ${c.org}`)}, url: ${JSON.stringify(url)} };
  if (navigator.share) { try { await navigator.share(d); } catch (e) {} return; }
  try { await navigator.clipboard.writeText(d.url); b.lastChild.textContent = " Bağlantı kopyalandı"; } catch (e) { location.href = d.url; }
});
</script>
</body>
</html>`;
}
