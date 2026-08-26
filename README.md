# Find My Phone

Ring your lost phone from your watch. Tapping the button on the watch makes
your phone play a high-priority alert — even in Do-Not-Disturb mode.

## How it works

Apps on the watch cannot reach the internet directly. Instead the watch sends a
request over Bluetooth to the **Side Service** (a small companion program that
runs inside the phone app), which performs the network call and reports back.

```
watch button -> BLE -> Side Service -> ntfy.sh/<topic> --push--> phone rings
```

This is the same architecture used throughout these example apps: the watch
sends a request over Bluetooth to the Side Service, which performs the network
call and reports back. The only difference is the backend — here it's a free
push service (ntfy) instead of a custom API.

## Setup

### 1. On your phone
- Install the [ntfy](https://ntfy.sh) app and subscribe to a topic, e.g.
  `https://ntfy.sh/<your-random-topic>`. The topic is the secret that identifies
  your phone — pick a long random string.
- In the watch app's settings, enter that topic.

### 2. Build & install
Requires Node ≥ 14 and the Zeus CLI (`npm i -g @zeppos/zeus-cli`).

```
npm install
zeus build
```

Then sideload the generated `dist/*.zab` via Developer Mode, or `zeus dev` with
a connected watch.

## Privacy
The topic is the only secret. It is stored only on the watch (settings) and in
the ntfy app on your phone. No account, no server of ours involved.
