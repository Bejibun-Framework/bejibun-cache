/** Error thrown for cache configuration and runtime failures. */
export default class CacheException extends Error {
    /** Numeric status code for the exception. */
    code: number;
    /**
     * Creates a cache exception.
     *
     * @param {string} message - Error message.
     * @param {number} code - Status code, defaults to 503.
     */
    constructor(message?: string, code?: number);
}
