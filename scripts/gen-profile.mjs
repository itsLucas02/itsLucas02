/**
 * Generates the minimal profile README assets — intro banner, "find me
 * elsewhere" divider, social panels and the project bento — in the
 * Swiss-mono style (light + dark). Deterministic: same input -> same output.
 * Run: node scripts/gen-profile.mjs
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "assets");
const COVERS = join(OUT, "covers");

const THEMES = {
  light: { ink: "#171717", muted: "#737373", hair: "#dedede", surface: "#f7f7f7" },
  dark: { ink: "#fafafa", muted: "#a3a3a3", hair: "#303030", surface: "#141414" },
};
const ACCENT = "#e53935";
const FONT = "JetBrains Mono, ui-monospace, Menlo, Consolas, monospace";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// --- intro banner ----------------------------------------------------------
const INTRO = {
  alt: "Aizzul Luqman — XR developer building immersive products.",
  line1: "Aizzul Luqman",
  line2: "XR developer building immersive products.",
  footLeft: "SELECTED WORK",
  footRight: "04 PROJECTS",
};

function intro(theme) {
  const c = THEMES[theme];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1110" height="245" viewBox="0 0 1110 245"><title>${esc(INTRO.alt)}</title><path d="M0 20H32" stroke="${ACCENT}" stroke-width="3"/><g font-family="${FONT}"><text x="0" y="87" fill="${c.ink}" font-size="43" font-weight="600" letter-spacing="-2">${esc(INTRO.line1)}</text><text x="0" y="142" fill="${c.muted}" font-size="43" font-weight="500" letter-spacing="-2">${esc(INTRO.line2)}</text><path d="M0 195H1110" stroke="${c.hair}"/><text x="0" y="226" fill="${c.muted}" font-size="12" letter-spacing="2.5">${esc(INTRO.footLeft)}</text><text x="1110" y="226" text-anchor="end" fill="${c.muted}" font-size="12" letter-spacing="1">${esc(INTRO.footRight)}</text></g></svg>\n`;
}

// --- "find me elsewhere" divider ------------------------------------------
function socialHeader(theme) {
  const c = THEMES[theme];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1110" height="125" viewBox="0 0 1110 125"><title>Find me elsewhere</title><path d="M0 24H1110" stroke="${c.hair}"/><path d="M0 59H32" stroke="${ACCENT}" stroke-width="3"/><text x="0" y="104" font-family="${FONT}" font-size="22" font-weight="500" fill="${c.ink}">Find me elsewhere</text></svg>\n`;
}

// --- icons (drawn inside a 52x52 box, centred on 26,26) --------------------
const LINKEDIN =
  "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z";
const GITHUB =
  "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";
const XMARK =
  "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z";
const GMAIL = `<g transform="translate(12 16) scale(.2)"><path fill="#4285F4" d="M18 90V30L0 16V90Z"/><path fill="#34A853" d="M122 90V30L140 16V90Z"/><path fill="#EA4335" d="M18 30L70 69L122 30V8L70 47L18 8Z"/><path fill="#FBBC04" d="M122 8L132 0Q140 0 140 10V30L122 44Z"/><path fill="#C5221F" d="M0 10Q0 0 8 0L18 8V44L0 30Z"/></g>`;

function icon(id, theme) {
  const c = THEMES[theme];
  const box = `<rect x="1" y="1" width="50" height="50" rx="14" fill="${c.surface}" stroke="${c.hair}"/>`;
  switch (id) {
    case "website":
      return `${box}<g fill="none" stroke="${c.ink}" stroke-width="1.7" stroke-linecap="round"><circle cx="26" cy="26" r="12"/><ellipse cx="26" cy="26" rx="5.5" ry="12"/><path d="M14 26H38M16 20H36M16 32H36"/></g>`;
    case "linkedin":
      return `<rect x="1" y="1" width="50" height="50" rx="14" fill="#000" stroke="#303030"/><rect x="13" y="13" width="26" height="26" rx="2" fill="#fff"/><g transform="translate(13 13) scale(1.625)" fill="#0A66C2"><path d="${LINKEDIN}"/></g>`;
    case "github":
      return `${box}<g transform="translate(13 13) scale(1.0833333)" fill="${c.ink}"><path d="${GITHUB}"/></g>`;
    case "x":
      return `${box}<g transform="translate(13 13) scale(1.0833333)" fill="${c.ink}"><path d="${XMARK}"/></g>`;
    case "email":
      return `${box}${GMAIL}`;
  }
}

const SOCIALS = [
  { id: "website", title: "Website" },
  { id: "linkedin", title: "LinkedIn" },
  { id: "github", title: "GitHub" },
  { id: "x", title: "X" },
  { id: "email", title: "Email" },
];

function panel(theme, { id, title }, i) {
  const c = THEMES[theme];
  const isFirst = i === 0;
  const isLast = i === SOCIALS.length - 1;
  const shape = isFirst
    ? `<path d="M18 1H222V99H18Q1 99 1 82V18Q1 1 18 1Z" fill="${c.surface}"/><path d="M222 1H18Q1 1 1 18V82Q1 99 18 99H222" fill="none" stroke="${c.hair}"/>`
    : isLast
      ? `<path d="M0 1H204Q221 1 221 18V82Q221 99 204 99H0Z" fill="${c.surface}"/><path d="M0 1H204Q221 1 221 18V82Q221 99 204 99H0" fill="none" stroke="${c.hair}"/>`
      : `<rect y="1" width="222" height="98" fill="${c.surface}"/><path d="M0 1H222M0 99H222" stroke="${c.hair}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="222" height="100" viewBox="0 0 222 100"><title>${esc(title)}</title>${shape}<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" x="85" y="24"><title>${esc(title)}</title>${icon(id, theme)}</svg></svg>\n`;
}

// --- project bento ---------------------------------------------------------
// Placeholder covers sourced from Pexels (free to use). Swap the files in
// assets/covers/ for real screenshots and re-run — the SVG embeds them.
const PROJECTS = [
  { x: 0, y: 0, w: 420, h: 540, cat: "PRODUCT", title: "MediBrave", caption: "Clinic operations platform, pre-launch", cover: "medibrave.jpg", tint: "#1f7a4d" },
  { x: 440, y: 0, w: 670, h: 260, cat: "XR", title: "Virtual Odyssey", caption: "Malaysia's heritage in virtual reality", cover: "virtual-odyssey.jpg", tint: "#6a3bd0" },
  { x: 440, y: 280, w: 380, h: 260, cat: "PRODUCT", title: "Clinizaro", caption: "Clinic CRM for Klinik Seri Ayu", cover: "clinizaro.jpg", tint: "#2f8fd8" },
  { x: 840, y: 280, w: 270, h: 260, cat: "SITE", title: "Timberhall Studio", caption: "A fictional studio in one HTML file", cover: "timberhall.jpg", tint: "#c2741a" },
];

async function bento() {
  const tiles = [];
  for (let i = 0; i < PROJECTS.length; i++) {
    const p = PROJECTS[i];
    const idx = String(i + 1).padStart(2, "0");
    const size = Math.min(28, (p.w - 52) / (Math.max(p.title.length, 1) * 0.6)).toFixed(1);
    const capSize = Math.min(12, (p.w - 52) / (Math.max(p.caption.length, 1) * 0.6)).toFixed(1);
    const image = "data:image/jpeg;base64," + (await readFile(join(COVERS, p.cover))).toString("base64");
    tiles.push(
      `<svg x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" viewBox="0 0 ${p.w} ${p.h}"><title>${esc(p.title)} — ${esc(p.caption)}</title><defs><clipPath id="clip-${idx}"><rect width="${p.w}" height="${p.h}" rx="24"/></clipPath><linearGradient id="shade-${idx}" x1="0%" y1="0%" x2="0%" y2="100%"><stop stop-color="#000" stop-opacity=".34"/><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".82"/></linearGradient></defs><g clip-path="url(#clip-${idx})"><image href="${image}" width="${p.w}" height="${p.h}" preserveAspectRatio="xMidYMid slice"/><rect width="${p.w}" height="${p.h}" fill="${p.tint}" style="mix-blend-mode:color" opacity="0.72"/><rect width="${p.w}" height="${p.h}" fill="url(#shade-${idx})"/></g><rect x="0.5" y="0.5" width="${p.w - 1}" height="${p.h - 1}" rx="23.5" fill="none" stroke="#ffffff" stroke-opacity=".12"/><path d="M${p.w - 48} 40l15-15m-15 0h15v15" stroke="#fff" stroke-width="2" fill="none"/><g font-family="${FONT}"><text x="26" y="36" font-size="11" letter-spacing="2"><tspan fill="${ACCENT}">${idx}</tspan><tspan fill="#e5e5e5"> / ${esc(p.cat)}</tspan></text><text x="26" y="${p.h - 62}" font-size="${size}" font-weight="600" letter-spacing="-1" fill="#fff">${esc(p.title)}</text><text x="26" y="${p.h - 30}" font-size="${capSize}" fill="#d4d4d4">${esc(p.caption)}</text></g></svg>`,
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1110" height="540" viewBox="0 0 1110 540"><title>Selected projects</title>${tiles.join("")}</svg>\n`;
}

// --- write -----------------------------------------------------------------
await mkdir(OUT, { recursive: true });
const files = [];
for (const theme of ["light", "dark"]) {
  files.push([`intro-${theme}.svg`, intro(theme)]);
  files.push([`social-header-${theme}.svg`, socialHeader(theme)]);
  SOCIALS.forEach((s, i) => files.push([`social-panel-${s.id}-${theme}.svg`, panel(theme, s, i)]));
}
files.push(["bento-projects.svg", await bento()]);

for (const [name, svg] of files) {
  await writeFile(join(OUT, name), svg, "utf8");
  console.log("wrote", name);
}
console.log(`\n${files.length} assets -> assets/`);
