// Side Service backend: posts a high-priority message to an ntfy.sh topic.
// ntfy is free, open-source, no account needed - the user just installs
// the ntfy app (https://ntfy.sh) and subscribes to their topic. A
// priority-5 ("max"/emergency) message makes the phone ring even in
// Do-Not-Disturb mode. This is the same Side-Service-to-web-backend
// pattern as in app-side/nuki-web-backend.js.
//
// fetch() here is the Side Service global (Node-fetch-like, but
// NOT a real Promise with a working native timeout) - hence the
// Promise.race watchdog below.

import { ERR_NO_TOPIC, ERR_NETWORK, ERR_TIMEOUT } from '../shared/protocol'

const NTFY_BASE = 'https://ntfy.sh'
const REQUEST_TIMEOUT_MS = 8000

function getTopic() {
  return settings.settingsStorage.getItem('ntfyTopic') || ''
}

function fetchWithTimeout(url, options) {
  return Promise.race([
    fetch(Object.assign({ url }, options)),
    new Promise((_resolve, reject) => {
      setTimeout(() => reject(new Error('timeout')), REQUEST_TIMEOUT_MS)
    }),
  ])
}

// Sends a max-priority ping to the configured topic. Normalizes every
// failure (no topic, network error, timeout) into a protocol ERR_* code.
export async function ringPhone() {
  const topic = getTopic()
  if (!topic) {
    return { error: ERR_NO_TOPIC }
  }

  const url = NTFY_BASE + '/' + encodeURIComponent(topic)
  try {
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        Title: 'Find My Phone',
        Priority: '5',
        Tags: 'telephone',
        // Mark as notification so the ntfy app surfaces it prominently.
        'Content-Type': 'text/plain',
      },
      body: 'Tap to locate your phone from your watch.',
    })

    // 2xx = accepted by ntfy. 4xx/5xx = server rejected (e.g. topic with
    // a slash, or ntfy down) - treat as a network-level error for the UI.
    if (res.status >= 400) {
      return { error: ERR_NETWORK }
    }
    return { data: null }
  } catch (e) {
    if (e && e.message === 'timeout') {
      return { error: ERR_TIMEOUT }
    }
    return { error: ERR_NETWORK }
  }
}
