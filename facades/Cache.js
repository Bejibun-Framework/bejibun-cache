import CacheBuilder from "../builders/CacheBuilder";
/** Static facade providing a convenient entry point to the cache builder. */
export default class Cache {
    /**
     * Creates a cache builder bound to a connection.
     *
     * @param {string} connection - Connection name.
     * @returns {CacheBuilder} A cache builder bound to the connection.
     */
    static connection(connection) {
        return new CacheBuilder().connection(connection);
    }
    /**
     * Gets a key, invoking the callback to populate it when missing.
     *
     * @param {string} key - Cache key.
     * @param {Function} callback - Function that produces the value.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<any>} The cached value or the callback result.
     */
    static async remember(key, callback, ttl) {
        return new CacheBuilder().remember(key, callback, ttl);
    }
    /**
     * Checks whether a key exists.
     *
     * @param {string} key - Cache key.
     * @returns {Promise<boolean>} Whether the key exists.
     */
    static async has(key) {
        return new CacheBuilder().has(key);
    }
    /**
     * Retrieves a cached value.
     *
     * @param {string} key - Cache key.
     * @returns {Promise<any>} The cached value, or empty when missing.
     */
    static async get(key) {
        return new CacheBuilder().get(key);
    }
    /**
     * Adds a value only if the key does not already exist.
     *
     * @param {string} key - Cache key.
     * @param {any} value - Value to store.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<boolean>} Whether the value was stored.
     */
    static async add(key, value, ttl) {
        return new CacheBuilder().add(key, value, ttl);
    }
    /**
     * Stores a value, overwriting any existing entry.
     *
     * @param {string} key - Cache key.
     * @param {any} value - Value to store.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<boolean>} Whether the value was stored.
     */
    static async put(key, value, ttl) {
        return new CacheBuilder().put(key, value, ttl);
    }
    /**
     * Removes a cached value.
     *
     * @param {string} key - Cache key.
     */
    static async forget(key) {
        return new CacheBuilder().forget(key);
    }
    /**
     * Increments a numeric cache value by one.
     *
     * @param {string} key - Cache key.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} The value after increment.
     */
    static async increment(key, ttl) {
        return new CacheBuilder().increment(key, ttl);
    }
    /**
     * Decrements a numeric cache value by one.
     *
     * @param {string} key - Cache key.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} The value after decrement.
     */
    static async decrement(key, ttl) {
        return new CacheBuilder().decrement(key, ttl);
    }
    /**
     * Increments a numeric cache value by a given amount.
     *
     * @param {string} key - Cache key.
     * @param {number} increment - Amount to add.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} The value after increment.
     */
    static async incrementBy(key, increment, ttl) {
        return new CacheBuilder().incrementBy(key, increment, ttl);
    }
    /**
     * Decrements a numeric cache value by a given amount.
     *
     * @param {string} key - Cache key.
     * @param {number} decrement - Amount to subtract.
     * @param {number} ttl - Time to live in seconds.
     * @returns {Promise<number>} The value after decrement.
     */
    static async decrementBy(key, decrement, ttl) {
        return new CacheBuilder().decrementBy(key, decrement, ttl);
    }
}
