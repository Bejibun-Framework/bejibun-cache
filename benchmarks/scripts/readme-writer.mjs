/**
 * Writes benchmark output directly into ../README.md between a pair of HTML comment
 * markers, so results never have to be hand-copied. Everything outside the markers
 * (headings, explanatory prose) is left untouched.
 *
 *   <!-- BENCHMARK:NAME:START -->
 *   ...replaced on every run...
 *   <!-- BENCHMARK:NAME:END -->
 */
import {readFileSync, writeFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const README_PATH = path.join(__dirname, "..", "README.md");

export function updateReadmeSection(marker, markdown) {
    const start = `<!-- BENCHMARK:${marker}:START -->`;
    const end = `<!-- BENCHMARK:${marker}:END -->`;

    const readme = readFileSync(README_PATH, "utf8");
    const startIdx = readme.indexOf(start);
    const endIdx = readme.indexOf(end);

    if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
        console.warn(
            `README markers for "${marker}" not found in ${README_PATH} -- skipping README update.`
        );
        return;
    }

    const before = readme.slice(0, startIdx + start.length);
    const after = readme.slice(endIdx);
    writeFileSync(README_PATH, `${before}\n${markdown}\n${after}`);
}
