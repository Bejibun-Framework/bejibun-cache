console.log = () => {};
console.error = () => {};

const {default: Cache} = await import("../../index.js");
const {default: CacheBuilder} = await import("../../builders/CacheBuilder.js");

const ITERATIONS = 20_000;
const WARMUP = 500;

for (let i = 0; i < WARMUP; i++) {
    const b = new CacheBuilder();
    b.driver;
}

let t0 = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    const b = new CacheBuilder();
    b.driver;
}
const buildMs = performance.now() - t0;

await Cache.connection("redis").put("bench:put", "bench-value");

for (let i = 0; i < WARMUP; i++) {
    await Cache.connection("redis").put("bench:put", "bench-value");
    await Cache.connection("redis").get("bench:key-old");
    await Cache.connection("redis").has("bench:key-old");
}

t0 = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    await Cache.connection("redis").put("bench:put", "bench-value");
}
const putMs = performance.now() - t0;

await Cache.connection("redis").put("bench:key", "bench-value");

t0 = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    await Cache.connection("redis").get("bench:key");
}
const getMs = performance.now() - t0;

t0 = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    await Cache.connection("redis").has("bench:key");
}
const hasMs = performance.now() - t0;

process.stdout.write(`${buildMs}|${putMs}|${getMs}|${hasMs}\n`);
