# ZenFlow

ZenFlow is a soothing day-organization and habit-tracking app built with Expo (React Native) and Flask. It helps you plan daily routines, track progress, and stay motivated with timely push notifications.

## Features
- Email/Google/Apple login
- Daily plans with repeat schedules and reminders (start/end/5-min-before)
- Expo push notifications (Android/iOS) with background scheduler
- In-App Purchases (iOS receipt validation on server; Android WIP)
- Beautiful UI with smooth animations

## Repos
- Client: `client/` (Expo)
- Server: `server/` (Flask + Supabase)

## Quick start
1) Client
```
cd client
npm install
npx expo start
```
Use a development build for push notifications.

2) Server
```
cd server
pip install -r requirements.txt
cp env.example .env
# Fill .env (Supabase, JWT, ITUNES_SHARED_SECRET, etc.)
python main.py
```

## Push Notifications
- Uses Expo push service; device registers token on startup.
- Android/iOS branding configured via `expo-notifications` plugin in `app.json`.
- Test via server endpoint `/api/push/send-test` or Expo tool.

## IAP
- iOS: server endpoint `/api/iap/verify-ios` validates with Apple and marks premium.
- Android: integrate Play verification next; placeholder disabled.

## Server endpoints
See `server/README.md` for the full list.

## Build tips
- For notifications and native APIs, use dev or release builds, not Expo Go.
- Ensure Android notification icon is a white transparent PNG.

## License
MIT