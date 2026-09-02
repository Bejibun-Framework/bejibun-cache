/** Builds cache operations for the configured driver (local filesystem or Redis). */
export default class CacheBuilder {
    /** The loaded cache configuration object. */
    protected conf: Record<string, any>;
    /** The name of the active cache connection. */
    protected conn?: string;
    /** The prefix prepended to every cache key. */
    protected prefix: string;
    /** The lazily-initialized Redis client instance. */
    protected rds?: Record<string, any>;
    /** Loads cache configuration from the app config or the built-in default. */
    constructor();
    /**
     * Lazily creates and returns the Redis client for the configured connection.
     *
     * @returns {Record<string, any>} The client bound to the cache prefix.
     */
    private get redis();
    /**
     * Returns the loaded cache configuration, throwing when none is provided.
     *
     * @throws {CacheException} When no config is present.
     * @returns {Record<string, any>} The loaded cache configuration.
     */
    private get config();
    /**
     * Returns the active connection config, falling back to the default connection.
     *
     * @returns {any} The active connection definition.
     */
    private get currentConnection();
    /**
     * Resolves and validates the current cache driver.
     *
     * @throws {CacheException} When the driver is missing, unsupported, or misconfigured.
     * @returns {any} The resolved driver name.
     */
    private get driver();
    /**
     * Builds a normalized storage key from the prefix and input key.
     *
     * @param {string} key - Raw cache key.
     * @returns {string} The normalized storage key.
     */
    private key;
    /**
     * Resolves the absolute file path for a local cache entry.
     *
     * @param {string} key - Raw cache key.
     * @returns {string} The absolute cache file path.
     */
    private filePath;
    /**
     * Returns the Bun file handle for a local cache entry.
     *
     * @param {string} key - Raw cache key.
     * @returns {Bun.BunFile} The file handle for the cache entry.
     */
    private file;
    /**
     * Writes a local cache entry, preserving an existing TTL when none is given.
     *
     * @param {string} key - Raw cache key.
     * @param {any} data - Value to store.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} Bytes written to the cache file.
     */
    private setFile;
    /**
     * Reads and expires a local cache entry, returning empty metadata on miss.
     *
     * @param {string} key - Raw cache key.
     * @returns {Promise<CacheFile>} The entry metadata, or empty on miss.
     */
    private getFile;
    /**
     * Sets the connection to use for subsequent operations.
     *
     * @param {string} conn - Connection name.
     * @returns {CacheBuilder} The builder bound to the connection.
     */
    connection(conn: string): CacheBuilder;
    /**
     * Gets a key, invoking the callback to populate it when missing.
     *
     * @param {string} key - Cache key.
     * @param {Function} callback - Function that produces the value.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<any>} The remembered value.
     */
    remember(key: string, callback: () => {}, ttl?: number): Promise<any>;
    /**
     * Checks whether a key exists.
     *
     * @param {string} key - Cache key.
     * @returns {Promise<boolean>} Whether the key exists.
     */
    has(key: string): Promise<boolean>;
    /**
     * Retrieves a cached value.
     *
     * @param {string} key - Cache key.
     * @returns {Promise<any>} The cached value, or empty when missing.
     */
    get(key: string): Promise<any>;
    /**
     * Adds a value only if the key does not already exist.
     *
     * @param {string} key - Cache key.
     * @param {any} value - Value to store.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<boolean>} Whether the value was newly stored.
     */
    add(key: string, value: any, ttl?: number): Promise<boolean>;
    /**
     * Stores a value, overwriting any existing entry.
     *
     * @param {string} key - Cache key.
     * @param {any} value - Value to store.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<boolean>} Whether the value was stored.
     */
    put(key: string, value: any, ttl?: number): Promise<boolean>;
    /**
     * Removes a cached value.
     *
     * @param {string} key - Cache key.
     */
    forget(key: string): Promise<void>;
    /**
     * Increments a numeric cache value by one.
     *
     * @param {string} key - Cache key.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} The value after increment.
     */
    increment(key: string, ttl?: number): Promise<number>;
    /**
     * Decrements a numeric cache value by one.
     *
     * @param {string} key - Cache key.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} The value after decrement.
     */
    decrement(key: string, ttl?: number): Promise<number>;
    /**
     * Increments a numeric cache value by a given amount.
     *
     * @param {string} key - Cache key.
     * @param {number} increment - Amount to add.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} The value after increment.
     */
    incrementBy(key: string, increment: number, ttl?: number): Promise<number>;
    /**
     * Decrements a numeric cache value by a given amount.
     *
     * @param {string} key - Cache key.
     * @param {number} decrement - Amount to subtract.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} The value after decrement.
     */
    decrementBy(key: string, decrement: number, ttl?: number): Promise<number>;
}
