import App from "@bejibun/app";
import CacheDriverEnum from "../enums/CacheDriverEnum";
/** Default cache configuration with named driver connections. */
const config = {
    /** Default connection name used when none is specified. */
    default: "redis",
    /** Named cache driver connections. */
    connections: {
        /** Local filesystem cache driver. */
        local: {
            driver: CacheDriverEnum.Local,
            path: App.Path.storagePath("cache") // absolute path
        },
        /** Redis cache driver. */
        redis: {
            driver: CacheDriverEnum.Redis,
            host: "127.0.0.1",
            port: 6379,
            password: "",
            database: 0
        }
    }
};
export default config;
