/**
 * Throughput benchmark.
 *
 * Measures the hot paths touched on every cache operation, method by method. On baseline
 * each `new CacheBuilder()` re-reads the config file from disk (`fs.existsSync` +
 * `require()`) and the driver getter resolves through a fresh enum builder (`Object.keys`
 * scan); the optimized build uses a cached config, a module-level driver set, and a
 * native unix timestamp. `put`/`get`/`has` exercise the full facade path against the
 * configured Redis driver. Requires a live Redis server on `127.0.0.1:6379`.
 *
 * Run: bun run scripts/throughput.mjs
 */
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import path from "node:path";
import {printTable} from "./table-format.mjs";
import {updateReadmeSection} from "./readme-writer.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRIALS = 15;
const runtime = process.execPath;

function runTrials(scriptPath) {
    const results = [];
    for (let i = 0; i < TRIALS; i++) {
        const res = spawnSync(runtime, [scriptPath], {encoding: "utf8"});
        if (res.status !== 0) {
            console.error("Benchmark failed:", res.stderr);
            process.exit(1);
        }
        results.push(res.stdout.trim().split("|").map(Number));
    }
    return results;
}

function medianRow(trials) {
    const cols = trials[0].length;
    const medians = [];
    for (let c = 0; c < cols; c++) {
        const sorted = trials.map((t) => t[c]).sort((a, b) => a - b);
        medians.push(sorted[Math.floor(sorted.length / 2)]);
    }
    return medians;
}

const ITERATIONS = 20_000;
const methods = ["construction", "redis Cache.put()", "redis Cache.get()", "redis Cache.has()"];
const bCols = medianRow(runTrials(path.join(__dirname, "throughput-baseline.mjs")));
const oCols = medianRow(runTrials(path.join(__dirname, "throughput-optimized.mjs")));

function fmt(ms) {
    return ms < 1 ? `${(ms * 1000).toFixed(0)}\u00B5s` : `${ms.toFixed(1)}ms`;
}

function sp(b, o) {
    const r = b / o;
    return r >= 1.05 ? `${r.toFixed(2)}x` : r <= 0.95 ? `${r.toFixed(2)}x` : "~1.0x";
}

function ops(ms) {
    return Math.round(ITERATIONS / (ms / 1000)).toLocaleString() + "/s";
}

const rows = methods.map((m, i) => ({
    cells: [m, fmt(bCols[i]), fmt(oCols[i]), sp(bCols[i], oCols[i]), ops(oCols[i])]
}));

printTable({
    title: "THROUGHPUT BENCHMARK",
    subtitle: `${ITERATIONS.toLocaleString()} calls each, ${TRIALS} runs (median)`,
    headers: ["Method", "Baseline (0.1.25)", "Optimized", "Speedup", "Optimized ops/s"],
    rows
});

const lines = [
    "| Method | baseline (0.1.25) | optimized | speedup | baseline ops/s | optimized ops/s |",
    "|---|---|---|---|---|---|",
    ...methods.map(
        (m, i) =>
            `| \`${m}\` | ${bCols[i].toFixed(1)}ms | ${oCols[i].toFixed(1)}ms | **${(bCols[i] / oCols[i]).toFixed(2)}x** | ${ops(bCols[i])} | ${ops(oCols[i])} |`
    )
];

updateReadmeSection("THROUGHPUT", lines.join("\n"));
