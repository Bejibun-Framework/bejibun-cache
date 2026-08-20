# Changelog
All notable changes to this project will be documented in this file.

---

## [v0.1.25](https://github.com/Bejibun-Framework/bejibun-cache/compare/v0.1.24...v0.1.25) - 2026-08-20

### 🩹 Fixes

### 📖 Changes
#### Tooling
- Added `prettier` + `.prettierrc.json` / `.prettierignore` and an `eslint.config.js` (flat config, `typescript-eslint`) for consistent formatting/linting across `src`
- Added `bun run format`, `bun run eslint`, and `bun run lint` scripts; `bun run build` now runs `lint` before compiling
- `alias` script now runs `tsc-alias` directly instead of via `bunx`

### 📦 Dependencies

- Bumped [`@bejibun/app`](https://github.com/Bejibun-Framework/bejibun-app) from `^0.1.24` to `^0.1.25`
- Bumped [`@bejibun/logger`](https://github.com/Bejibun-Framework/bejibun-logger) from `^0.1.22` to `^0.1.23`
- Bumped [`@bejibun/redis`](https://github.com/Bejibun-Framework/bejibun-redis) from `^0.1.46` to `^0.1.47`
- Bumped [`@bejibun/utils`](https://github.com/Bejibun-Framework/bejibun-utils) from `^0.1.28` to `^0.1.29`
- Bumped `tsc-alias` (devDependency) from `^1.9.1` to `^1.9.2`
- Added `@eslint/js` (devDependency) `^10.0.1`
- Added `eslint` (devDependency) `^10.8.1`
- Added `eslint-config-prettier` (devDependency) `^10.1.8`
- Added `globals` (devDependency) `^17.11.0`
- Added `prettier` (devDependency) `^3.9.6`
- Added `typescript` (devDependency) `^6.0.3`
- Added `typescript-eslint` (devDependency) `^8.67.0`

### 📦 Dependencies
- Upgraded `@bejibun/redis` to v0.1.46

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-cache/blob/master/CHANGELOG.md

---

## [v0.1.24](https://github.com/Bejibun-Framework/bejibun-cache/compare/v0.1.23...v0.1.24) - 2026-08-02

### 🩹 Fixes

### 📖 Changes

### 📦 Dependencies
- Upgraded `@bejibun/redis` to v0.1.46

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-cache/blob/master/CHANGELOG.md

---

## [v0.1.23](https://github.com/Bejibun-Framework/bejibun-cache/compare/v0.1.22...v0.1.23) - 2026-06-02

### 🩹 Fixes

### 📖 Changes
- Added `.incrementBy()` Increment a numeric value by a specified amount
- Added `.decrementBy()` Decrement a numeric value by a specified amount

### 📦 Dependencies
- Upgraded `@bejibun/redis` to v0.1.45

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-cache/blob/master/CHANGELOG.md

---

## [v0.1.22](https://github.com/Bejibun-Framework/bejibun-cache/compare/v0.1.19...v0.1.22) - 2026-04-27

### 🩹 Fixes

### 📖 Changes
#### Upgrade [@bejibun/redis](https://github.com/Bejibun-Framework/bejibun-redis) to v0.1.44
[https://github.com/Bejibun-Framework/bejibun-redis/releases/tag/v0.1.44](https://github.com/Bejibun-Framework/bejibun-redis/releases/tag/v0.1.44)

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-cache/blob/master/CHANGELOG.md

---

## [v0.1.20](https://github.com/Bejibun-Framework/bejibun-cache/compare/v0.1.19...v0.1.20) - 2026-03-18

### 🩹 Fixes

### 📖 Changes
#### Upgrade [@bejibun/redis](https://github.com/Bejibun-Framework/bejibun-redis) to v0.1.40
[https://github.com/Bejibun-Framework/bejibun-redis/releases/tag/v0.1.40](https://github.com/Bejibun-Framework/bejibun-redis/releases/tag/v0.1.40)

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-cache/blob/master/CHANGELOG.md

---

## [v0.1.19](https://github.com/Bejibun-Framework/bejibun-cache/compare/v0.1.16...v0.1.19) - 2026-03-02

### 🩹 Fixes

### 📖 Changes
#### Upgrade [@bejibun/redis](https://github.com/Bejibun-Framework/bejibun-redis) to v0.1.39
[https://github.com/Bejibun-Framework/bejibun-redis/releases/tag/v0.1.39](https://github.com/Bejibun-Framework/bejibun-redis/releases/tag/v0.1.39)

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-cache/blob/master/CHANGELOG.md

---

## [v0.1.16](https://github.com/Bejibun-Framework/bejibun-cache/compare/v0.1.15...v0.1.16) - 2025-12-15

### 🩹 Fixes
- Something went wrong when processing cache file with TTL - [#2](https://github.com/Bejibun-Framework/bejibun-cache/issues/2)

### 📖 Changes

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-cache/blob/master/CHANGELOG.md

---

## [v0.1.15](https://github.com/Bejibun-Framework/bejibun-cache/compare/v0.1.14...v0.1.15) - 2025-12-14

### 🩹 Fixes

### 📖 Changes
What's New :
- Added `connection()` to override cache connection.

Makes it more flexible by overriding connections at runtime.

- Added `driver` configuration.

#### What's its use?
The cache connection name is no longer static as before.

e.g. :
```text
connections: {
    local: {
        path: App.Path.storagePath("cache") // absolute path
    }
}
```

You can now create a connection with any name and specify which driver to use.

```text
connections: {
    custom_name: {
        driver: CacheDriverEnum.Local, // "local", "redis"
        path: App.Path.storagePath("custom-cache")
    }
}
```

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-cache/blob/master/CHANGELOG.md

---

## [v0.1.14](https://github.com/Bejibun-Framework/bejibun-cache/compare/v0.1.12...v0.1.14) - 2025-12-12

### 🩹 Fixes
- Redis connection with Cache own configuration - [#1](https://github.com/Bejibun-Framework/bejibun-core/issues/1)

### 📖 Changes
What's New :
- Adding `ttl` supports for file scheme.

#### How does it work?
When you use a cache and include a `ttl`, the system generates a `unix timestamp` and adds it with specified `ttl`.
Then system will write it to a file in the format `ttl|file`, separated by the `|` symbol.

When you call data from the cache, the system creates metadata consisting of the `ttl` and `data` by splitting them with `|`.
The system then checks if the `ttl` is empty and returns the data.

Or if the `ttl` is present, the system checks whether the `current timestamp` <= `ttl`?
If so, the data is returned. Otherwise, the cache file will be deleted and returned null.

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-cache/blob/master/CHANGELOG.md

---

## [v0.1.12](https://github.com/Bejibun-Framework/bejibun-cache/compare/v0.1.11...v0.1.12) - 2025-12-04

### 🩹 Fixes

### 📖 Changes
What's New :
- Adding `local` connection for file schema

Now, [@bejibun/cache](https://github.com/Bejibun-Framework/bejibun-cache) has local and redis for cache system.

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-cache/blob/master/CHANGELOG.md

---

## [v0.1.11](https://github.com/Bejibun-Framework/bejibun-cache/compare/v0.1.0...v0.1.11) - 2025-11-23

### 🩹 Fixes

### 📖 Changes
What's New :
- Adding `ttl` supports for increment & decrement

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-cache/blob/master/CHANGELOG.md

---

## [v0.1.1](https://github.com/Bejibun-Framework/bejibun-cache/compare/v0.1.0...v0.1.1) - 2025-11-23

### 🩹 Fixes

### 📖 Changes
What's New :
- Adding cache `ttl` support
- `.increment()` Increment cache counter
- `.decrement()` Decrement cache counter

### ❤️Contributors
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-cache/blob/master/CHANGELOG.md

---

## [v0.1.0](https://github.com/Bejibun-Framework/bejibun-cache/compare/v0.1.0...v0.1.0) - 2025-11-09

### 🩹 Fixes

### 📖 Changes
What's New :
Cache with Redis, currently only redis.

- `.remember()` Fetch data from cache if exists
- `.has()` Check if cache exists
- `.get()` Fetch data from cache
- `.add()` Insert data to cache, will return false if cache is already exists
- `.put()` Update cache data
- `.forget()` Delete cache

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-cache/blob/master/CHANGELOG.md