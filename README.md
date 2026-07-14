# Pathao Fare Estimator API

A tiny, free-to-run REST API that estimates Pathao-style ride fares (Bike, CNG, Car)
for Dhaka, Chattogram, and Sylhet.

**Important:** This is an unofficial estimator built on publicly reported rate cards.
It is not affiliated with, endorsed by, or pulling live data from Pathao Ltd.

## 1. Run it locally

```bash
npm install
npm start
```

Server runs on `http://localhost:3000` by default (or `$PORT` if set).

## 2. Endpoints

### `GET /`
Basic info about the API.

### `GET /vehicles`
Lists available vehicle types and the cities each one supports.

```bash
curl http://localhost:3000/vehicles
```

### `GET /estimate`
Query params (all required):
- `vehicle` — `bike` | `cng` | `car`
- `city` — `dhaka` | `chattogram` | `sylhet` (bike only supports all three; cng/car are Dhaka only)
- `distance_km` — number
- `duration_min` — number

```bash
curl "http://localhost:3000/estimate?vehicle=bike&city=dhaka&distance_km=5&duration_min=15"
```

Response:
```json
{
  "vehicle": "Bike",
  "city": "dhaka",
  "input": { "distance_km": 5, "duration_min": 15 },
  "breakdown": {
    "baseFare": 25,
    "distanceCharge": 75,
    "timeCharge": 7.5,
    "minimumFare": 50
  },
  "estimatedFare": 107.5,
  "currency": "BDT",
  "disclaimer": "Estimate only, based on publicly reported rate cards. Not official Pathao pricing."
}
```

## 3. Deploy it for free (so it's actually a public API)

Any of these work well for a small Express app:

**Render.com** (easiest)
1. Push this folder to a GitHub repo.
2. On Render: New → Web Service → connect the repo.
3. Build command: `npm install`
4. Start command: `npm start`
5. Deploy — you'll get a public URL like `https://your-app.onrender.com`

**Railway.app**
1. Push to GitHub.
2. New Project → Deploy from GitHub repo.
3. Railway auto-detects Node and runs `npm start`.

**Fly.io**
1. `fly launch` in this folder (it'll detect Node/Express).
2. `fly deploy`

Once deployed, your public endpoint becomes e.g.:
`https://your-app.onrender.com/estimate?vehicle=bike&city=dhaka&distance_km=5&duration_min=15`

That's the URL you'd call from your other app as an "external API."

## 4. Updating rates later

All fare numbers live in `rates.js`. Edit the numbers there and redeploy —
no changes needed in `server.js`.
