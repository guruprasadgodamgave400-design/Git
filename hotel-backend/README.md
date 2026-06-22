# Aurelia Hotel — Backend API

REST API for the Aurelia hotel booking platform. Express + MongoDB + JWT.

## Stack

- **Node.js** (>= 18) + **Express 4**
- **MongoDB** via Mongoose 8
- **JWT** auth (Bearer tokens, `HS256`)
- **bcryptjs** for password hashing (12 rounds)
- **express-validator** for input validation
- **helmet**, **cors**, **morgan**, **express-rate-limit**

## Setup

```bash
cd hotel-backend
cp .env.example .env       # then edit values
npm install
npm run seed               # creates admin + rooms + reviews + content
npm run dev                # http://localhost:5000
```

Environment variables (see `.env.example`):

| Variable | Description |
| --- | --- |
| `PORT` | API port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string for signing tokens |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `CORS_ORIGIN` | Comma-separated allowed origins |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Seed admin user |

## Response envelope

Every response is JSON:

```json
{ "success": true, "statusCode": 200, "message": "OK", "data": { ... } }
```

Errors:

```json
{ "success": false, "statusCode": 422, "message": "Validation failed", "details": [...] }
```

## Authentication

All `/api/auth/*` routes are rate-limited (20 req / 15 min / IP).
Send the JWT as `Authorization: Bearer <token>` for protected routes.

### `POST /api/auth/register`
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "Secret123", "phone": "+91 90000 00000" }
```
Returns `{ user, token }`.

### `POST /api/auth/login`
```json
{ "email": "jane@example.com", "password": "Secret123" }
```
Returns `{ user, token }`.

### `GET /api/auth/me` — requires auth
### `PATCH /api/auth/me` — update profile
### `POST /api/auth/change-password` — `{ currentPassword, newPassword }`

## Rooms

### `GET /api/rooms`
Query: `featured=true|false`, `view=City skyline`, `q=deluxe`, `minPrice`, `maxPrice`, `sort=recommended|price-asc|price-desc|rating`, `limit=20`

Returns `{ rooms: [...] }`. Each room includes computed `rating` and `reviewsCount` from approved reviews.

### `GET /api/rooms/:id`
### `POST /api/rooms` — admin only
### `PATCH /api/rooms/:id` — admin only
### `DELETE /api/rooms/:id` — admin only (soft archive: `isActive=false`)

Room payload:
```json
{
  "id": "...",
  "name": "Deluxe Heritage Room",
  "tagline": "City skyline views with curated art",
  "description": "...",
  "price": 3200,
  "image": "https://...",
  "gallery": ["..."],
  "bed": "1 King bed",
  "guests": 2,
  "size": "42 m²",
  "view": "City skyline",
  "amenities": ["..."],
  "featured": true,
  "inventory": 8,
  "rating": 4.7,
  "reviewsCount": 248
}
```

## Bookings

### `GET /api/bookings/availability`
Query: `roomId`, `checkIn` (ISO date), `checkOut` (ISO date), `roomsCount=1`
Returns inventory, reserved, remaining and an `available` boolean.

### `POST /api/bookings` — requires auth
```json
{
  "roomId": "...",
  "checkIn": "2026-08-12",
  "checkOut": "2026-08-15",
  "guests": 2,
  "roomsCount": 1,
  "guestName": "Jane Doe",
  "guestEmail": "jane@example.com",
  "guestPhone": "+91 90000 00000",
  "specialRequests": "Late check-in around 11pm",
  "payment": "card"
}
```
Re-validates availability, calculates nights × price + 12% tax. Returns `{ bookingId, status, placedAt, booking, stay, totals }`.

### `GET /api/bookings/mine` — requires auth
### `GET /api/bookings/:id` — owner or admin
### `POST /api/bookings/:id/cancel` — owner or admin
### `GET /api/bookings` — admin only
### `PATCH /api/bookings/:id/status` — admin only (`status: pending|confirmed|cancelled|checked_in|checked_out`)

## Reviews

### `GET /api/reviews?roomId=...`
### `POST /api/reviews` — requires auth
```json
{ "roomId": "...", "rating": 5, "title": "Magical stay", "body": "Longer body...", "location": "Mumbai, India" }
```
### `DELETE /api/reviews/:id` — owner or admin

## Content (amenities / testimonials / offers)

### `GET /api/content/amenities`
### `GET /api/content/testimonials`
### `GET /api/content/offers`
### `PUT /api/content/{amenities|testimonials|offers}` — admin only, body `{ items: [...] }`

These endpoints return shapes that match the frontend's previous mock contract — `{ items: [...] }`.

## Admin

All `/api/admin/*` routes require `role: "admin"`.

### `GET /api/admin/users`
### `PATCH /api/admin/users/:id` — body `{ "role": "user" | "admin" }`
### `GET /api/admin/stats`
Returns `{ users, rooms, bookings, revenue, reviews }`.

## Health

### `GET /health`
Returns `{ success: true, data: { uptime } }`.

## Frontend integration

Set `VITE_API_BASE_URL=http://localhost:5000/api` in `hotel-frontend/.env`.
The existing `src/services/api.js` will automatically switch from mock data to the live API.

## Folder structure

```
hotel-backend/
├── src/
│   ├── server.js               # bootstrap + DB connect + listen
│   ├── app.js                  # express app (middleware + routes)
│   ├── config/db.js
│   ├── models/                 # User, Room, Booking, Review, Content
│   ├── controllers/            # auth, rooms, bookings, reviews, content, admin
│   ├── routes/                 # mount controllers
│   ├── middleware/             # auth, error, validate
│   ├── utils/                  # ApiError, ApiResponse, asyncHandler
│   └── seed/seedRooms.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```