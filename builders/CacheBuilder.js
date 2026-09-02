import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import Redis from "@bejibun/redis";
import { defineValue, isEmpty, isNotEmpty } from "@bejibun/utils";
import { mkdir } from "fs/promises";
import path from "path";
import CacheDriverEnum from "../enums/CacheDriverEnum";
import CacheException from "../exceptions/CacheException";
/** The app cache config, loaded once from disk. */
let cachedConfig;
/** The Redis clients already created per cache prefix. */
const cachedClients = new Map();
/** The set of cache drivers this builder supports. */
const validDrivers = new Set(Object.values(CacheDriverEnum));
/** Resolves the current unix timestamp in seconds. */
const unix = () => Math.floor(Date.now() / 1000);
/**
 * Loads the app cache config from disk once, falling back to the built-in default.
 *
 * @returns {any} The loaded cache configuration.
 */
const loadConfig = () => {
    if (cachedConfig)
        return cachedConfig;
    try {
        cachedConfig = require(App.Path.configPath("cache.ts")).default;
    }
    catch {
        cachedConfig = require("../config/cache").default;
    }
    return cachedConfig;
};
/** Builds cache operations for the configured driver (local filesystem or Redis). */
export default class CacheBuilder {
    /** The loaded cache configuration object. */
    conf;
    /** The name of the active cache connection. */
    conn;
    /** The prefix prepended to every cache key. */
    prefix;
    /** The lazily-initialized Redis client instance. */
    rds;
    /** Loads cache configuration from the app config or the built-in default. */
    constructor() {
        this.conf = loadConfig();
        this.prefix = "bejibun-cache";
    }
    /**
     * Lazily creates and returns the Redis client for the configured connection.
     *
     * @returns {Record<string, any>} The client bound to the cache prefix.
     */
    get redis() {
        if (isEmpty(this.rds)) {
            let client = cachedClients.get(this.prefix);
            if (isEmpty(client)) {
                const redisConnection = defineValue(this.conf.connections?.redis, {
                    host: "127.0.0.1",
                    port: 6379,
                    password: "",
                    database: 0
                });
                client = Redis.setClient({
                    host: redisConnection.host,
                    port: redisConnection.port,
                    password: redisConnection.password,
                    database: redisConnection.database
                }, this.prefix);
                cachedClients.set(this.prefix, client);
            }
            this.rds = client;
        }
        return this.rds;
    }
    /**
     * Returns the loaded cache configuration, throwing when none is provided.
     *
     * @throws {CacheException} When no config is present.
     * @returns {Record<string, any>} The loaded cache configuration.
     */
    get config() {
        if (isEmpty(this.conf))
            throw new CacheException("There is no config provided.");
        return this.conf;
    }
    /**
     * Returns the active connection config, falling back to the default connection.
     *
     * @returns {any} The active connection definition.
     */
    get currentConnection() {
        return this.config.connections[defineValue(this.conn, this.config.default)];
    }
    /**
     * Resolves and validates the current cache driver.
     *
     * @throws {CacheException} When the driver is missing, unsupported, or misconfigured.
     * @returns {any} The resolved driver name.
     */
    get driver() {
        const driver = defineValue(this.currentConnection?.driver);
        if (isEmpty(driver))
            throw new CacheException(`Missing "driver" on cache config.`);
        if (!validDrivers.has(driver))
            throw new CacheException(`Not supported "driver" cache.`);
        switch (driver) {
            case CacheDriverEnum.Local:
                if (isEmpty(this.currentConnection?.path))
                    throw new CacheException(`Missing "path" for "local" cache configuration.`);
                break;
            case CacheDriverEnum.Redis:
                if (isEmpty(this.currentConnection?.host))
                    throw new CacheException(`Missing "host" for "redis" cache configuration.`);
                if (isEmpty(this.currentConnection?.port))
                    throw new CacheException(`Missing "port" for "redis" cache configuration.`);
                break;
            default:
                break;
        }
        return driver;
    }
    /**
     * Builds a normalized storage key from the prefix and input key.
     *
     * @param {string} key - Raw cache key.
     * @returns {string} The normalized storage key.
     */
    key(key) {
        return `${this.prefix}-${key.replaceAll("/", "-").replaceAll(" ", "-")}`;
    }
    /**
     * Resolves the absolute file path for a local cache entry.
     *
     * @param {string} key - Raw cache key.
     * @returns {string} The absolute cache file path.
     */
    filePath(key) {
        return path.resolve(this.currentConnection.path, `${this.key(key)}.cache`);
    }
    /**
     * Returns the Bun file handle for a local cache entry.
     *
     * @param {string} key - Raw cache key.
     * @returns {Bun.BunFile} The file handle for the cache entry.
     */
    file(key) {
        return Bun.file(this.filePath(key));
    }
    /**
     * Writes a local cache entry, preserving an existing TTL when none is given.
     *
     * @param {string} key - Raw cache key.
     * @param {any} data - Value to store.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} Bytes written to the cache file.
     */
    async setFile(key, data, ttl) {
        ttl = defineValue(ttl, "");
        if (isNotEmpty(ttl))
            ttl = unix() + Number(ttl);
        const raw = await this.getFile(key);
        if (isNotEmpty(raw.ttl))
            ttl = Number(raw.ttl);
        await mkdir(this.currentConnection.path, { recursive: true });
        return await Bun.write(this.filePath(key), `${ttl}|${data}`);
    }
    /**
     * Reads and expires a local cache entry, returning empty metadata on miss.
     *
     * @param {string} key - Raw cache key.
     * @returns {Promise<CacheFile>} The entry metadata, or empty on miss.
     */
    async getFile(key) {
        let metadata = {
            ttl: null,
            data: null
        };
        try {
            const file = this.file(key);
            if (await file.exists()) {
                const raw = await file.text();
                const [unixTimestamp, ...rest] = raw.split("|");
                const ttl = Number(unixTimestamp);
                const data = rest.join("|");
                if (isEmpty(ttl) || unix() <= ttl)
                    metadata = {
                        ttl: defineValue(Number(ttl)),
                        data
                    };
                else
                    await file.delete();
            }
        }
        catch (error) {
            Logger.setContext("Cache")
                .error("Something went wrong when processing cache file.")
                .trace(error);
        }
        return metadata;
    }
    /**
     * Sets the connection to use for subsequent operations.
     *
     * @param {string} conn - Connection name.
     * @returns {CacheBuilder} The builder bound to the connection.
     */
    connection(conn) {
        this.conn = conn;
        return this;
    }
    /**
     * Gets a key, invoking the callback to populate it when missing.
     *
     * @param {string} key - Cache key.
     * @param {Function} callback - Function that produces the value.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<any>} The remembered value.
     */
    async remember(key, callback, ttl) {
        let data;
        switch (this.driver) {
            case CacheDriverEnum.Local: {
                const raw = await this.getFile(key);
                data = raw.data;
                if (isEmpty(data)) {
                    data = callback();
                    await this.setFile(key, data, ttl);
                }
                break;
            }
            case CacheDriverEnum.Redis:
                data = await this.redis.get(this.key(key));
                if (isEmpty(data)) {
                    data = callback();
                    await this.redis.set(this.key(key), data, ttl);
                }
                break;
            default:
                data = null;
                break;
        }
        return data;
    }
    /**
     * Checks whether a key exists.
     *
     * @param {string} key - Cache key.
     * @returns {Promise<boolean>} Whether the key exists.
     */
    async has(key) {
        let data;
        switch (this.driver) {
            case CacheDriverEnum.Local: {
                const raw = await this.getFile(key);
                data = raw.data;
                break;
            }
            case CacheDriverEnum.Redis:
                data = await this.redis.get(this.key(key));
                break;
            default:
                data = false;
                break;
        }
        return isNotEmpty(data);
    }
    /**
     * Retrieves a cached value.
     *
     * @param {string} key - Cache key.
     * @returns {Promise<any>} The cached value, or empty when missing.
     */
    async get(key) {
        let data;
        switch (this.driver) {
            case CacheDriverEnum.Local: {
                const raw = await this.getFile(key);
                data = raw.data;
                break;
            }
            case CacheDriverEnum.Redis:
                data = await this.redis.get(this.key(key));
                break;
            default:
                data = false;
                break;
        }
        return data;
    }
    /**
     * Adds a value only if the key does not already exist.
     *
     * @param {string} key - Cache key.
     * @param {any} value - Value to store.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<boolean>} Whether the value was newly stored.
     */
    async add(key, value, ttl) {
        let status = true;
        let data;
        try {
            switch (this.driver) {
                case CacheDriverEnum.Local: {
                    const raw = await this.getFile(key);
                    data = raw.data;
                    break;
                }
                case CacheDriverEnum.Redis:
                    data = await this.redis.get(this.key(key));
                    break;
                default:
                    data = null;
                    break;
            }
            if (isEmpty(data)) {
                switch (this.driver) {
                    case CacheDriverEnum.Local:
                        await this.setFile(key, value, ttl);
                        break;
                    case CacheDriverEnum.Redis:
                        await this.redis.set(this.key(key), value, ttl);
                        break;
                    default:
                        break;
                }
            }
            else {
                status = false;
                Logger.setContext("Cache").info("The cache key is already exists.");
            }
        }
        catch (error) {
            status = false;
            Logger.setContext("Cache").error("Failed to add cache.").trace(error);
        }
        return status;
    }
    /**
     * Stores a value, overwriting any existing entry.
     *
     * @param {string} key - Cache key.
     * @param {any} value - Value to store.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<boolean>} Whether the value was stored.
     */
    async put(key, value, ttl) {
        let status = true;
        try {
            switch (this.driver) {
                case CacheDriverEnum.Local:
                    await this.setFile(key, value, ttl);
                    break;
                case CacheDriverEnum.Redis:
                    await this.redis.set(this.key(key), value, ttl);
                    break;
                default:
                    break;
            }
        }
        catch (error) {
            status = false;
            Logger.setContext("Cache").error("Failed to add cache.").trace(error);
        }
        return status;
    }
    /**
     * Removes a cached value.
     *
     * @param {string} key - Cache key.
     */
    async forget(key) {
        switch (this.driver) {
            case CacheDriverEnum.Local:
                try {
                    await this.file(key).delete();
                }
                catch {
                    break;
                }
                break;
            case CacheDriverEnum.Redis:
                await this.redis.del(this.key(key));
                break;
            default:
                break;
        }
    }
    /**
     * Increments a numeric cache value by one.
     *
     * @param {string} key - Cache key.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} The value after increment.
     */
    async increment(key, ttl) {
        let data;
        switch (this.driver) {
            case CacheDriverEnum.Local: {
                const raw = await this.getFile(key);
                data = Number(raw.data);
                if (isEmpty(data)) {
                    data = 1;
                    await this.setFile(key, String(data), ttl);
                }
                else {
                    data++;
                    await this.setFile(key, String(data), ttl);
                }
                break;
            }
            case CacheDriverEnum.Redis:
                data = Number(await this.redis.get(this.key(key)));
                if (isEmpty(data)) {
                    data = 1;
                    await this.redis.set(this.key(key), data, ttl);
                }
                else {
                    data++;
                    await this.redis.set(this.key(key), data, ttl);
                }
                break;
            default:
                data = 0;
                break;
        }
        return data;
    }
    /**
     * Decrements a numeric cache value by one.
     *
     * @param {string} key - Cache key.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} The value after decrement.
     */
    async decrement(key, ttl) {
        let data;
        switch (this.driver) {
            case CacheDriverEnum.Local: {
                const raw = await this.getFile(key);
                data = Number(raw.data);
                if (isEmpty(data)) {
                    data = -1;
                    await this.setFile(key, String(data), ttl);
                }
                else {
                    data--;
                    await this.setFile(key, String(data), ttl);
                }
                break;
            }
            case CacheDriverEnum.Redis:
                data = Number(await this.redis.get(this.key(key)));
                if (isEmpty(data)) {
                    data = -1;
                    await this.redis.set(this.key(key), data, ttl);
                }
                else {
                    data--;
                    await this.redis.set(this.key(key), data, ttl);
                }
                break;
            default:
                data = 0;
                break;
        }
        return data;
    }
    /**
     * Increments a numeric cache value by a given amount.
     *
     * @param {string} key - Cache key.
     * @param {number} increment - Amount to add.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} The value after increment.
     */
    async incrementBy(key, increment, ttl) {
        let data;
        switch (this.driver) {
            case CacheDriverEnum.Local: {
                const raw = await this.getFile(key);
                data = Number(raw.data);
                if (isEmpty(data)) {
                    data = increment;
                    await this.setFile(key, String(data), ttl);
                }
                else {
                    data += increment;
                    await this.setFile(key, String(data), ttl);
                }
                break;
            }
            case CacheDriverEnum.Redis:
                data = Number(await this.redis.get(this.key(key)));
                if (isEmpty(data)) {
                    data = increment;
                    await this.redis.set(this.key(key), data, ttl);
                }
                else {
                    data += increment;
                    await this.redis.set(this.key(key), data, ttl);
                }
                break;
            default:
                data = 0;
                break;
        }
        return data;
    }
    /**
     * Decrements a numeric cache value by a given amount.
     *
     * @param {string} key - Cache key.
     * @param {number} decrement - Amount to subtract.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} The value after decrement.
     */
    async decrementBy(key, decrement, ttl) {
        let data;
        switch (this.driver) {
            case CacheDriverEnum.Local: {
                const raw = await this.getFile(key);
                data = Number(raw.data);
                if (isEmpty(data)) {
                    data = -decrement;
                    await this.setFile(key, String(data), ttl);
                }
                else {
                    data -= decrement;
                    await this.setFile(key, String(data), ttl);
                }
                break;
            }
            case CacheDriverEnum.Redis:
                data = Number(await this.redis.get(this.key(key)));
                if (isEmpty(data)) {
                    data = -decrement;
                    await this.redis.set(this.key(key), data, ttl);
                }
                else {
                    data -= decrement;
                    await this.redis.set(this.key(key), data, ttl);
                }
                break;
            default:
                data = 0;
                break;
        }
        return data;
    }
}
