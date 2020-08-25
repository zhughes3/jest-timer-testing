const Manager = require ('./Manager')

jest.useFakeTimers()

test("cacheEntry gets deleted", async () => {
    const expirationDurationSeconds = 60
    const cacheEntry = {
        key: "bar",
        value: "foo"
    }

    // part 1: add the cache entry
    await Manager.createDeleteOnExpireCache(cacheEntry.key, expirationDurationSeconds, cacheEntry.value)

    // part 2: verify that cache entry has been added properly before expiration event gets emitted
    let cacheValue = await Manager.getKey(cacheEntry.key)
    expect(cacheValue).toEqual(cacheEntry.value)

    // part 3: test that cache entry has been deleted after expiration time has passed
    jest.advanceTimersByTime((expirationDurationSeconds + 1) * 1000) // forceExpiration
    await flushPromises()

    let expiredCacheValue = await Manager.getKey(cacheEntry.key)
    // since the expire event never gets emitted, and the expire function never runs,
    // the cache entry never gets deleted and still has the original value
    expect(expiredCacheValue).toEqual(undefined)
})

function flushPromises() {
    return new Promise(resolve => setImmediate(resolve));
}

