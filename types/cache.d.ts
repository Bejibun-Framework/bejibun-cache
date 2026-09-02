/** Metadata read from a local cache file. */
export type CacheFile = {
    /** Time-to-live in milliseconds, or null for no expiry. */
    ttl: number | null;

    /** The cached value payload. */
    data: any;
};
