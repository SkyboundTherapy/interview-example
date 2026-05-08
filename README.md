# Skybound Interview Example

A minimal, runnable example of the stack used for Skybound's technical interview. Use this to confirm your local setup works before the interview, and to get familiar with the tools we use.

It is **not** the interview itself — there's no challenge here. The interview repo will be sent separately.

This README walks you through getting the stack running locally on **macOS**. It assumes a clean machine; skip steps you've already done.

## Stack at a glance

- **Frontend**: Expo (React Native + Web), Expo Router, [`@terreno/ui`](https://www.npmjs.com/package/@terreno/ui)
- **Backend**: Node.js, Express 5, [`@terreno/api`](https://www.npmjs.com/package/@terreno/api), Mongoose, MongoDB
- **Tooling**: Yarn 1.x, TypeScript, Biome (lint + format), Jest

You can run this entirely in a web browser — native iOS / Android tooling is optional.

## Project layout

```
backend/
  src/
    server.ts         Express + @terreno/api setup
    user.ts           User model
    loadDb.ts         Seed script
    server.test.ts    Backend tests
frontend/
  app/                Expo Router routes (login, /admin, /user)
  components/         Shared UI
  contexts/           AuthContext (login + JWT storage)
  metro.config.js     Metro resolver overrides for unused transitive deps
```

---

## 1. Prerequisites (one-time macOS setup)

### Apple command-line tools

```bash
xcode-select --install
```

### Homebrew

If you don't already have it:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the post-install instructions — Homebrew will tell you to add itself to your shell `PATH`.

### Node.js 22

```bash
brew install node@22
brew link --overwrite node@22

node --version    # → v22.x
npm --version
```

If you manage multiple Node versions, `nvm install 22 && nvm use 22` works too.

### Yarn 1.x

This project uses Yarn Classic (not Yarn 2/Berry). The simplest install:

```bash
npm install -g yarn
yarn --version    # → 1.22.x
```

### MongoDB Community Edition + `mongosh`

```bash
brew tap mongodb/brew
brew install mongodb-community
brew install mongosh

# Start it as a background service
brew services start mongodb/brew/mongodb-community

# Verify it's running
mongosh --eval "db.adminCommand('ping')"
# → { ok: 1 }
```

To stop it later: `brew services stop mongodb/brew/mongodb-community`.

### Watchman (recommended)

Prevents file-watcher edge cases on Expo / React Native:

```bash
brew install watchman
```

### Optional — only if you want to run on a real iOS / Android device or simulator

- **iOS**: install [Xcode from the App Store](https://apps.apple.com/us/app/xcode/id497799835), open it once to accept the license, then run `sudo xcodebuild -runFirstLaunch`.
- **Android**: install [Android Studio](https://developer.android.com/studio), open SDK Manager, and install at least one Android SDK + emulator image. Make sure `JAVA_HOME` points at JDK 17+ (`brew install --cask zulu@17` works).
- **Expo Go on a physical device**: install the [Expo Go](https://expo.dev/go) app from the App Store / Play Store, then scan the QR code from `yarn start`.

You don't need any of these to run the example — the web build covers everything.

---

## 2. Install project dependencies

From the repo root:

```bash
cd backend && yarn install
cd ../frontend && yarn install
```

`yarn install` will pull the local `expo` CLI into `node_modules` — there is **no separate global Expo CLI install needed**. `yarn web`, `yarn ios`, etc. invoke the local one.

---

## 3. Seed the database

```bash
cd backend
yarn loaddb
```

This drops and recreates the `example` MongoDB database with the seed users. Run it any time you want a clean slate.

Test credentials seeded by `loaddb`:

| Email                | Password   | Role  |
| -------------------- | ---------- | ----- |
| `admin@example.com`  | `password` | Admin |
| `user@example.com`   | `password` | User  |

The two roles route to different dashboards (`/admin` vs `/user`) — this demonstrates the role-based routing pattern used in the actual interview repo. Both dashboards in this example are intentionally minimal.

---

## 4. Run it

Two terminals:

**Backend (terminal 1):**

```bash
cd backend
yarn dev
# API on http://localhost:9000
```

**Frontend (terminal 2):**

```bash
cd frontend
yarn web
# App on http://localhost:8081
```

Open `http://localhost:8081` in your browser and log in with one of the seeded accounts above.

---

## 5. Useful scripts

### Backend (`backend/`)

| Command        | What it does                                                       |
| -------------- | ------------------------------------------------------------------ |
| `yarn dev`     | Start the API with hot reload on port 9000                         |
| `yarn test`    | Run the Jest test suite (in watch mode by default)                 |
| `yarn loaddb`  | Drop and reseed MongoDB                                            |
| `yarn lint`    | Biome check (lint + format)                                        |
| `yarn lintfix` | Biome check + auto-fix                                             |
| `yarn format`  | Biome format only                                                  |

### Frontend (`frontend/`)

| Command        | What it does                                              |
| -------------- | --------------------------------------------------------- |
| `yarn web`     | Start the Expo web dev server on port 8081                |
| `yarn start`   | Start the Expo dev server with QR code for Expo Go        |
| `yarn ios`     | Build and run on the iOS simulator (requires Xcode)       |
| `yarn android` | Build and run on Android (requires Android Studio + JDK)  |
| `yarn lint`    | Biome check (lint + format)                               |
| `yarn lintfix` | Biome check + auto-fix                                    |
| `yarn format`  | Biome format only                                         |

---

## Troubleshooting

- **`MongoServerSelectionError` / `ECONNREFUSED 127.0.0.1:27017`** — MongoDB isn't running. `brew services start mongodb/brew/mongodb-community`.
- **Port already in use** — `lsof -ti:9000 | xargs kill` (backend) or `lsof -ti:8081 | xargs kill` (frontend). Ports 9000 and 8081 are baked in.
- **`Cannot find module ...`** — re-run `yarn install` in the affected workspace; Expo SDK upgrades sometimes change resolution.
- **`watchman` errors after a system update** — `watchman watch-del-all` then restart `yarn web`.
- **Frontend reloads but backend changes aren't reflected** — the backend dev server uses nodemon; if it didn't pick up a `.ts` change, just restart `yarn dev`.
- **Stale data / weird state** — `yarn loaddb` from `backend/` resets MongoDB.
