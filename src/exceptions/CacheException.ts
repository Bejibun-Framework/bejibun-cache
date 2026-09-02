import Logger from "@bejibun/logger";
import {defineValue} from "@bejibun/utils";

/** Error thrown for cache configuration and runtime failures. */
export default class CacheException extends Error {
    /** Numeric status code for the exception. */
    public code: number;

    /**
     * Creates a cache exception.
     *
     * @param {string} message - Error message.
     * @param {number} code - Status code, defaults to 503.
     */
    public constructor(message?: string, code?: number) {
        super(message);
        this.name = "CacheException";
        this.code = defineValue(code, 503);

        Logger.setContext(this.name).error(this.message).trace(this.stack);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CacheException);
        }
    }
}
