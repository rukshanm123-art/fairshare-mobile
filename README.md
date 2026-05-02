# FairShare Mobile

React Native mobile app for the FairShare expense splitting platform. Built with Expo.

## Requirements

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- The [FairShare backend](https://github.com/rukshanm123-art/Fairshare) running locally
- [Expo Go](https://expo.dev/client) app on your phone (for quick preview)

## Setup

```bash
git clone https://github.com/rukshanm123-art/fairshare-mobile.git
cd fairshare-mobile
npm install
cp .env.example .env
```

Edit `.env` and set your backend URL:

| Device | URL |
|--------|-----|
| Android emulator | `http://10.0.2.2:3001` |
| iOS simulator | `http://localhost:3001` |
| Physical device | `http://<your-laptop-ip>:3001` |

## Run

```bash
npx expo start
```

Scan the QR code with **Expo Go** (Android) or the Camera app (iOS).

## Install on device (Android APK)

```bash
npm install -g eas-cli
eas login                              # log in with your Expo account
eas build --platform android --profile preview
```

Download the `.apk` from the build URL and install it directly on any Android phone.

## Backend CORS

Make sure the Fairshare backend allows requests from Expo. In the backend's `server.js` or `app.js`, ensure CORS accepts your device's IP or set `origin: '*'` for development:

```js
app.use(cors({ origin: '*' }))
```

## Features

- Login / Register
- Dashboard with net balance + stats
- Groups — create, invite members, view expenses
- Add expenses with equal split, categories
- Settle up — see who owes who, mark payments
- Analytics — monthly bar chart, category breakdown
- Profile / sign out

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Expo SDK 52 + Expo Router |
| Language | TypeScript |
| Styling | NativeWind (Tailwind CSS) |
| State | Zustand |
| HTTP | Axios |
| Real-time | Socket.io-client |
| Storage | Expo SecureStore |
| Charts | react-native-gifted-charts |
