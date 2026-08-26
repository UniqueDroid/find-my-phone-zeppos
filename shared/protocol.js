// Single source of truth for messages between Device App (watch) and
// Side Service (phone). Both sides import this file, so a typo in a
// method/error string becomes a build-time reference error instead of a
// silent runtime mismatch. Pattern copied 1:1 from the shared message layout.

// Device App -> Side Service request method.
export const METHOD_FIND_PHONE = 'FIND_PHONE'

// Side Service -> Device App error codes - sent as the `error` field of a
// response, alongside `result: null`.
export const ERR_NO_TOPIC = 'ERR_NO_TOPIC' // Settings has no ntfy topic saved yet
export const ERR_NETWORK = 'ERR_NETWORK' // fetch() itself threw (no network on the phone)
export const ERR_TIMEOUT = 'ERR_TIMEOUT' // our own watchdog fired (see backend fetchWithTimeout())
