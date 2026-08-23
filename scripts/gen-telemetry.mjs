/**
 * Generates assets/telemetry.svg — a HUD-style stat tile built from live
 * public GitHub API data. Zero third-party widget services involved.
 *
 * Run locally:  node scripts/gen-telemetry.mjs
 * On GitHub:    .github/workflows/update-telemetry.yml runs it daily.
 */
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const USER = "itsLucas02";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "telemetry.svg");

async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      "User-Agent": "profile-telemetry-bot",
      Accept: "application/vnd.github+json",
    },
  });
  if (!res.ok) throw new Error(`GitHub API ${path} -> ${res.status}`);
  return res.json();
}

const user = await gh(`/users/${USER}`);
const repos = [];
let page = 1;
while (page <= 5) {
  const batch = await gh(`/users/${USER}/repos?per_page=100&page=${page}&sort=updated`);
  repos.push(...batch);
  if (batch.length < 100) break;
  page += 1;
}

const stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
const yearsOnGitHub = Math.max(
  1,
  Math.floor((Date.now() - new Date(user.created_at).getTime()) / 31_557_600_000),
);

const CELLS = [
  { label: "FOLLOWERS",   value: String(user.followers),              accent: "#00F7FF" },
  { label: "PUBLIC REPOS", value: String(user.public_repos),          accent: "#FF3DF5" },
  { label: "STARS EARNED", value: String(stars),                      accent: "#9D5CFF" },
  { label: "YRS ON GITHUB", value: `${yearsOnGitHub}+`,               accent: "#57F287" },
];

const W = 495, H = 195;
const cells = CELLS.map((c, i) => {
  const x = 18 + (i % 2) * 232;
  const y = 44 + Math.floor(i / 2) * 72;
  return `  <!-- ${c.label} -->
  <rect x="${x}" y="${y}" width="222" height="60" rx="10" fill="#0E1526" stroke="#223052"/>
  <rect x="${x}" y="${y}" width="4" height="60" rx="2" fill="${c.accent}"/>
  <text x="${x + 16}" y="${y + 25}" font-family="'Courier New',monospace" font-size="11"
        letter-spacing="2" fill="#8FA3C8">${c.label}</text>
  <text x="${x + 206}" y="${y + 48}" text-anchor="end" font-family="'Courier New',monospace"
        font-size="26" font-weight="bold" fill="${c.accent}">${c.value}</text>`;
}).join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Live telemetry for ${USER}: followers, repositories, stars, account age">
  <rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="14" fill="#0A0F1E" stroke="#223052"/>
  <text x="22" y="30" font-family="'Courier New',monospace" font-size="13" font-weight="bold"
        letter-spacing="3" fill="#C9D6FF">TELEMETRY//${USER.toUpperCase()}</text>
  <circle cx="${W - 24}" cy="25" r="4" fill="#57F287">
    <animate attributeName="opacity" values="1;.2;1" dur="2s" repeatCount="indefinite"/>
  </circle>
${cells}
</svg>\n`;

await writeFile(OUT, svg, "utf8");
console.log(`telemetry.svg written: ${user.followers} followers · ${user.public_repos} repos · ${stars} stars · ${yearsOnGitHub}+ yrs`);
