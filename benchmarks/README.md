# Benchmarks

Speed comparison: baseline (previously published npm release) vs the optimized `@bejibun/cache` in this repo.

## Running

```bash
# Run all benchmarks (installs baseline from npm first)
bun run bench

# Or run individually (after install-deps)
bun run install-deps
bun run coldstart
bun run throughput
```

## Cold Start

Measures package import time by spawning fresh OS processes. Two metrics:

- **Full process time** — spawn → exit (includes Bun boot time)
- **Import** — measured inside the process, isolates the package's own import cost

<!-- BENCHMARK:COLDSTART:START -->

|                             | baseline | optimized | speedup   |
| --------------------------- | -------- | --------- | --------- |
| Full process (spawn → exit) | 28.6ms   | 28.2ms    | **1.01x** |
| Import                      | 19.0ms   | 18.1ms    | **1.05x** |

<!-- BENCHMARK:COLDSTART:END -->

## Throughput

The hot paths touched on every cache operation, measured per method. `construction` covers `new CacheBuilder()` plus driver resolution — baseline re-reads the config file from disk and resolves the driver through a fresh enum builder each time; the optimized build uses a cached config and a module-level driver set. `Cache.put()`, `Cache.get()`, and `Cache.has()` run the full facade against the configured Redis driver. Requires a live Redis server on `127.0.0.1:6379`. 20,000 calls each, median of 15 runs.

<!-- BENCHMARK:THROUGHPUT:START -->

| Method              | baseline (0.1.25) | optimized | speedup    | baseline ops/s | optimized ops/s |
| ------------------- | ----------------- | --------- | ---------- | -------------- | --------------- |
| `construction`      | 117.8ms           | 6.9ms     | **17.06x** | 169,780/s      | 2,897,108/s     |
| `redis Cache.put()` | 4734.1ms          | 1930.7ms  | **2.45x**  | 4,225/s        | 10,359/s        |
| `redis Cache.get()` | 3315.4ms          | 2010.8ms  | **1.65x**  | 6,032/s        | 9,946/s         |
| `redis Cache.has()` | 3308.6ms          | 2008.1ms  | **1.65x**  | 6,045/s        | 9,959/s         |

<!-- BENCHMARK:THROUGHPUT:END -->
