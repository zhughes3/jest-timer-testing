const NodeCache = require("node-cache")

const checkPeriod = 60

const cache = new NodeCache({
    checkperiod: checkPeriod,
    deleteOnExpire: false
})

cache.on("expired", async (cacheName, cacheValue) => {
    cache.del(cacheName)
})

class Manager {
    static async createDeleteOnExpireCache(key, expiration, value) {
        cache.set(key, value, expiration)
    }

    static async getKey(key) {
        return cache.get(key)
    }
}

module.exports = Manager
