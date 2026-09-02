import CacheBuilder from "../builders/CacheBuilder";
/** Static facade providing a convenient entry point to the cache builder. */
export default class Cache {
    /**
     * Creates a cache builder bound to a connection.
     *
     * @param {string} connection - Connection name.
     * @returns {CacheBuilder} A cache builder bound to the connection.
     */
    static connection(connection: string): CacheBuilder;
    /**
     * Gets a key, invoking the callback to populate it when missing.
     *
     * @param {string} key - Cache key.
     * @param {Function} callback - Function that produces the value.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<any>} The cached value or the callback result.
     */
    static remember(key: string, callback: () => {}, ttl?: number): Promise<any>;
    /**
     * Checks whether a key exists.
     *
     * @param {string} key - Cache key.
     * @returns {Promise<boolean>} Whether the key exists.
     */
    static has(key: string): Promise<boolean>;
    /**
     * Retrieves a cached value.
     *
     * @param {string} key - Cache key.
     * @returns {Promise<any>} The cached value, or empty when missing.
     */
    static get(key: string): Promise<any>;
    /**
     * Adds a value only if the key does not already exist.
     *
     * @param {string} key - Cache key.
     * @param {any} value - Value to store.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<boolean>} Whether the value was stored.
     */
    static add(key: string, value: any, ttl?: number): Promise<boolean>;
    /**
     * Stores a value, overwriting any existing entry.
     *
     * @param {string} key - Cache key.
     * @param {any} value - Value to store.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<boolean>} Whether the value was stored.
     */
    static put(key: string, value: any, ttl?: number): Promise<boolean>;
    /**
     * Removes a cached value.
     *
     * @param {string} key - Cache key.
     */
    static forget(key: string): Promise<void>;
    /**
     * Increments a numeric cache value by one.
     *
     * @param {string} key - Cache key.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} The value after increment.
     */
    static increment(key: string, ttl?: number): Promise<number>;
    /**
     * Decrements a numeric cache value by one.
     *
     * @param {string} key - Cache key.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} The value after decrement.
     */
    static decrement(key: string, ttl?: number): Promise<number>;
    /**
     * Increments a numeric cache value by a given amount.
     *
     * @param {string} key - Cache key.
     * @param {number} increment - Amount to add.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} The value after increment.
     */
    static incrementBy(key: string, increment: number, ttl?: number): Promise<number>;
    /**
     * Decrements a numeric cache value by a given amount.
     *
     * @param {string} key - Cache key.
     * @param {number} decrement - Amount to subtract.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} The value after decrement.
     */
    static decrementBy(key: string, decrement: number, ttl?: number): Promise<number>;
}
