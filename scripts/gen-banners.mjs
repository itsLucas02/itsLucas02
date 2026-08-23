/**
 * Generates the HUD section-divider SVGs for the profile README.
 * Deterministic: same input -> same output. Run: node scripts/gen-banners.mjs
 */
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");

const SECTIONS = [
  { file: "s01_operator_profile", num: "01", label: "OPERATOR PROFILE",  accent: "#00E5FF" },
  { file: "s02_tech_arsenal",     num: "02", label: "TECH ARSENAL",      accent: "#FF3DF5" },
  { file: "s03_telemetry",        num: "03", label: "TELEMETRY",         accent: "#9D5CFF" },
  { file: "s04_transmission",     num: "04", label: "TRANSMISSION",      accent: "#00E5FF" },
  { file: "s05_open_channel",     num: "05", label: "OPEN CHANNEL",      accent: "#FF3DF5" },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function divider({ num, label, accent }) {
  const W = 900, H = 92;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Section ${esc(num)} — ${esc(label)}">
  <defs>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${accent}" stop-opacity=".9"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="chip" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${accent}" stop-opacity=".22"/>
      <stop offset="1" stop-color="${accent}" stop-opacity=".05"/>
    </linearGradient>
  </defs>

  <!-- panel -->
  <rect x="8" y="10" width="${W - 16}" height="${H - 20}" rx="12" fill="#0A0F1E" stroke="#1E2A45"/>
  <!-- corner brackets -->
  <path d="M 22 22 h 26 M 22 22 v 16" stroke="${accent}" stroke-width="2.5" fill="none" opacity=".95"/>
  <path d="M ${W - 48} ${H - 34} h 26 M ${W - 22} ${H - 34} v 16" stroke="${accent}" stroke-width="2.5" fill="none" opacity=".95"/>

  <!-- number chip -->
  <rect x="46" y="30" width="64" height="32" rx="6" fill="url(#chip)" stroke="${accent}" stroke-opacity=".8"/>
  <text x="78" y="52" font-family="'Courier New',monospace" font-size="19" font-weight="bold"
        fill="${accent}" text-anchor="middle" letter-spacing="2">${esc(num)}</text>

  <!-- label -->
  <text x="132" y="53" font-family="'Courier New',monospace" font-size="23" font-weight="bold"
        fill="#E8F4FF" letter-spacing="7">${esc(label)}</text>

  <!-- rule + markers -->
  <rect x="132" y="66" height="2" width="${W - 190}" fill="url(#rule)"/>
  <path d="M ${W - 44} 46 l 10 6 l -10 6 z" fill="${accent}"/>
  <circle cx="${W - 58}" cy="52" r="2.5" fill="${accent}" opacity=".8"/>
</svg>\n`;
}

await mkdir(OUT_DIR, { recursive: true });
for (const s of SECTIONS) {
  await writeFile(join(OUT_DIR, `${s.file}.svg`), divider(s), "utf8");
  console.log("wrote", s.file + ".svg");
}
