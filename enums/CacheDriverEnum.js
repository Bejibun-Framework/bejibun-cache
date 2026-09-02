/** Supported cache driver identifiers. */
var CacheDriverEnum;
(function (CacheDriverEnum) {
    /** Local filesystem driver. */
    CacheDriverEnum["Local"] = "local";
    /** Redis driver. */
    CacheDriverEnum["Redis"] = "redis";
})(CacheDriverEnum || (CacheDriverEnum = {}));
export default CacheDriverEnum;
