import { readFile, writeFile } from "node:fs/promises";

const readmePath = new URL("../README.md", import.meta.url);
const themesUrl =
  "https://raw.githubusercontent.com/DenverCoder1/github-readme-streak-stats/main/docs/themes.md";

function parseThemes(markdown) {
  return [...markdown.matchAll(/^\|\s*`([^`]+)`\s*\|/gm)].map((match) => match[1]);
}

function chooseTheme(themes) {
  const daysSinceEpoch = Math.floor(Date.now() / 86_400_000);
  return themes[daysSinceEpoch % themes.length];
}

function updateStreakTheme(readme, nextTheme) {
  let didFindStreakCard = false;

  const updated = readme.replace(
    /https:\/\/streak-stats\.demolab\.com[^\s)\]]*/g,
    (rawUrl) => {
      didFindStreakCard = true;

      const url = new URL(rawUrl);
      const currentTheme = url.searchParams.get("theme");

      if (currentTheme === nextTheme) {
        return rawUrl;
      }

      url.searchParams.set("theme", nextTheme);
      return url.toString();
    },
  );

  if (!didFindStreakCard) {
    throw new Error("Could not find a streak-stats.demolab.com card in README.md.");
  }

  return updated;
}

const response = await fetch(themesUrl);

if (!response.ok) {
  throw new Error(`Failed to fetch themes.md: ${response.status} ${response.statusText}`);
}

const themes = parseThemes(await response.text());

if (themes.length === 0) {
  throw new Error("No themes were found in the streak stats themes.md file.");
}

const readme = await readFile(readmePath, "utf8");
const nextTheme = chooseTheme(themes);
const updatedReadme = updateStreakTheme(readme, nextTheme);

await writeFile(readmePath, updatedReadme, "utf8");

console.log(`Streak stats theme set to: ${nextTheme}`);
