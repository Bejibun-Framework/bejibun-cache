import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    mock,
    test
} from "bun:test";
import {mkdtempSync, rmSync} from "fs";
import {tmpdir} from "os";
import {join} from "path";
import CacheBuilder from "../src/builders/CacheBuilder";
import CacheConfig from "../src/config/cache";
import CacheDriverEnum from "../src/enums/CacheDriverEnum";

let localDir: string;

const log = mock(console.log);
const error = mock(console.error);

beforeAll(() => {
    localDir = mkdtempSync(join(tmpdir(), "bejibun-cache-"));
});

afterAll(() => {
    rmSync(localDir, {recursive: true, force: true});
});

beforeEach(() => {
    log.mockReset();
    error.mockReset();
    console.log = log;
    console.error = error;
});

afterEach(() => {
    console.log = console.log;
    console.error = console.error;
});

const localBuilder = (): CacheBuilder => {
    const builder = new CacheBuilder();

    (builder as any).conf = {
        default: "local",
        connections: {
            local: {
                driver: CacheDriverEnum.Local,
                path: localDir
            }
        }
    };

    return builder;
};

describe("CacheBuilder config", () => {
    test("fails with no config", () => {
        const builder = new CacheBuilder();

        (builder as any).conf = null;

        expect(() => (builder as any).driver).toThrow("There is no config provided.");
    });

    test("rejects an unsupported driver", () => {
        const builder = new CacheBuilder();

        (builder as any).conf = {
            default: "local",
            connections: {
                local: {driver: "dynamodb"}
            }
        };

        expect(() => (builder as any).driver).toThrow('Not supported "driver" cache.');
    });

    test("rejects a local driver without a path", () => {
        const builder = new CacheBuilder();

        (builder as any).conf = {
            default: "local",
            connections: {
                local: {driver: CacheDriverEnum.Local}
            }
        };

        expect(() => (builder as any).driver).toThrow('Missing "path" for "local" cache configuration.');
    });
});

describe("CacheBuilder local driver", () => {
    test("stores and retrieves a value", async () => {
        const cache = localBuilder();

        expect(await cache.put("store:greet", "hello")).toBe(true);
        expect(await cache.get("store:greet")).toBe("hello");
        expect(await cache.has("store:greet")).toBe(true);
    });

    test("overwrites an existing value", async () => {
        const cache = localBuilder();

        await cache.put("store:k", "one");
        await cache.put("store:k", "two");

        expect(await cache.get("store:k")).toBe("two");
    });

    test("returns empty on a missing key", async () => {
        const cache = localBuilder();

        expect(await cache.get("store:missing")).toBe(null);
        expect(await cache.has("store:missing")).toBe(false);
    });

    test("forget removes the key", async () => {
        const cache = localBuilder();

        await cache.put("forget:k", "v");
        await cache.forget("forget:k");

        expect(await cache.has("forget:k")).toBe(false);
    });

    test("expires a key after its ttl", async () => {
        const cache = localBuilder();

        await cache.put("ttl:k", "v", 2);
        expect(await cache.get("ttl:k")).toBe("v");

        const raw = await (cache as any).getFile("ttl:k");
        const expires = raw.ttl;

        await new Promise((resolve) => setTimeout(resolve, (expires - Math.floor(Date.now() / 1000)) * 1000 + 1500));

        expect(await cache.get("ttl:k")).toBe(null);
    });

    test("remember populates via the callback on a miss", async () => {
        const cache = localBuilder();
        let calls = 0;

        const value = await cache.remember("remember:k", () => {
            calls++;
            return "built";
        });

        expect(value).toBe("built");
        expect(await cache.get("remember:k")).toBe("built");
        expect(calls).toBe(1);
    });

    test("remember returns the cached value without re-invoking on a hit", async () => {
        const cache = localBuilder();
        let calls = 0;

        await cache.put("remember:k", "cached");

        const value = await cache.remember("remember:k", () => {
            calls++;
            return "rebuilt";
        });

        expect(value).toBe("cached");
        expect(calls).toBe(0);
    });

    test("add stores only when the key is missing", async () => {
        const cache = localBuilder();

        expect(await cache.add("add:k", "first")).toBe(true);
        expect(await cache.add("add:k", "second")).toBe(false);
        expect(await cache.get("add:k")).toBe("first");
    });

    test("increment and decrement mutate numeric values", async () => {
        const cache = localBuilder();

        expect(await cache.increment("num:n")).toBe(1);
        expect(await cache.increment("num:n")).toBe(2);
        expect(await cache.decrement("num:n")).toBe(1);

        expect(await cache.incrementBy("num:n", 5)).toBe(6);
        expect(await cache.decrementBy("num:n", 2)).toBe(4);
    });

    test("preserves the existing ttl on overwrite", async () => {
        const cache = localBuilder();

        await cache.put("ttl2:k", "v", 30);
        await cache.put("ttl2:k", "v2");

        const raw = await (cache as any).getFile("ttl2:k");

        expect(raw.data).toBe("v2");
        expect(raw.ttl).toBeGreaterThan(Math.floor(Date.now() / 1000) + 28);
    });
});

describe("CacheBuilder default config", () => {
    test("loads the bundled default when no user config exists", () => {
        const builder = new CacheBuilder();

        expect((builder as any).conf.default).toBe(CacheConfig.default);
        expect((builder as any).conf.connections).toEqual(CacheConfig.connections);
    });
});