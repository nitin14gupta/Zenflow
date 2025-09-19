# ZenFlow Server API

Flask API powering ZenFlow. Backed by Supabase for auth, data, and simple storage. Push handled via Expo Push Service.

## Health
- GET `/api/health` → `{ status, message, version }`

## Auth
- POST `/api/auth/register` → `{ token, user }`
- POST `/api/auth/login` → `{ token, user }`
- POST `/api/auth/google` → `{ token, user }`
- POST `/api/auth/apple` → `{ token, user }`
- POST `/api/auth/forgot-password` → `{ message }`
- POST `/api/auth/reset-password` → `{ message }`
- POST `/api/auth/verify-token` → `{ valid, user }`

## Plans
- POST `/api/plans/create` → create plan
- GET `/api/plans/user/:userId` → list plans for user
- PUT `/api/plans/:planId` → update
- DELETE `/api/plans/:planId` → delete
- PUT `/api/plans/:planId/complete` → toggle complete
- PUT `/api/plans/:planId/skip` → mark skipped
- DELETE `/api/plans/delete-all` → delete all (dev)

## Push Notifications
- POST `/api/push/register` → body `{ user_id?, expo_push_token }` upserts token
- POST `/api/push/send-test` → body `{ expo_push_token? | user_id?, title?, body?, data? }` sends through Expo

Background jobs (APScheduler):
- Daily nudges at 9,12,15,18,21
- Minute-by-minute plan reminders (start, end, before X minutes)

## In-App Purchases (IAP)
- POST `/api/iap/verify-ios` → body `{ user_id, receipt_data, product_id?, sandbox? }` verifies with Apple and marks premium

## Environment
Create `server/.env` using `server/env.example`:
- `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SERVICE_KEY`
- `JWT_SECRET_KEY`
- `ITUNES_SHARED_SECRET` (Apple)
- `EXPO_PUSH_ACCESS_TOKEN` (only if using Expo Push Security)
- `FLASK_DEBUG`, `PORT`

## Database Tables (Supabase)
- `users` with subscription fields: `is_premium`, `subscription_plan`, `subscription_expires_at`
- `password_reset_tokens`
- `daily_plans`
- `push_tokens`
- optional `push_events`

## Run locally
```
pip install -r requirements.txt
python main.py
```

## Notes
- Ensure only a single scheduler instance runs in production.