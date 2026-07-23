// server.js
const express = require("express");
const cors = require("cors");
const RATE_CARD = require("./rates");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// GET /
// Basic info so anyone hitting the root knows what this is.
app.get("/", (req, res) => {
  res.json({
    name: "Pathao Fare Estimator API",
    description:
      "Unofficial fare estimator modeled on publicly reported Pathao rate cards. Not affiliated with or endorsed by Pathao Ltd.",
    endpoints: {
      "/vehicles": "List available vehicle types and cities",
      "/rates?vehicle=bike&city=dhaka": "Get the raw rate-card numbers (base fare, per-km, per-min, minimum fare)",
      "/estimate?vehicle=bike&city=dhaka&distance_km=5&duration_min=15":
        "Get a fare estimate"
    }
  });
});

// GET /vehicles
// Returns the full rate card so consumers can see what's available.
app.get("/vehicles", (req, res) => {
  const vehicles = Object.entries(RATE_CARD).map(([key, v]) => ({
    vehicle: key,
    label: v.label,
    cities: Object.keys(v.city)
  }));
  res.json({ vehicles });
});

// GET /rates
// Query params: vehicle, city
// Returns the raw rate-card numbers (base fare, per-km, per-min, minimum fare)
app.get("/rates", (req, res) => {
  const { vehicle, city } = req.query;

  if (!vehicle || !city) {
    return res.status(400).json({
      error: "Missing required query params: vehicle, city"
    });
  }

  const vehicleData = RATE_CARD[vehicle.toLowerCase()];
  if (!vehicleData) {
    return res.status(404).json({
      error: `Unknown vehicle type "${vehicle}". Try one of: ${Object.keys(RATE_CARD).join(", ")}`
    });
  }

  const cityRates = vehicleData.city[city.toLowerCase()];
  if (!cityRates) {
    return res.status(404).json({
      error: `No rates for city "${city}" with vehicle "${vehicle}". Available cities: ${Object.keys(vehicleData.city).join(", ")}`
    });
  }

  res.json({
    vehicle: vehicleData.label,
    city: city.toLowerCase(),
    baseFare: cityRates.baseFare,
    perKm: cityRates.perKm,
    perMin: cityRates.perMin,
    minimumFare: cityRates.minimumFare,
    currency: "BDT",
    disclaimer:
      "Based on publicly reported rate cards. Not official Pathao pricing."
  });
});

// GET /estimate
// Query params: vehicle, city, distance_km, duration_min
app.get("/estimate", (req, res) => {
  const { vehicle, city, distance_km, duration_min } = req.query;

  if (!vehicle || !city || !distance_km || !duration_min) {
    return res.status(400).json({
      error:
        "Missing required query params: vehicle, city, distance_km, duration_min"
    });
  }

  const vehicleData = RATE_CARD[vehicle.toLowerCase()];
  if (!vehicleData) {
    return res.status(404).json({
      error: `Unknown vehicle type "${vehicle}". Try one of: ${Object.keys(RATE_CARD).join(", ")}`
    });
  }

  const cityRates = vehicleData.city[city.toLowerCase()];
  if (!cityRates) {
    return res.status(404).json({
      error: `No rates for city "${city}" with vehicle "${vehicle}". Available cities: ${Object.keys(vehicleData.city).join(", ")}`
    });
  }

  const distance = parseFloat(distance_km);
  const duration = parseFloat(duration_min);

  if (isNaN(distance) || isNaN(duration) || distance < 0 || duration < 0) {
    return res.status(400).json({
      error: "distance_km and duration_min must be non-negative numbers"
    });
  }

  const { baseFare, perKm, perMin, minimumFare } = cityRates;

  const rawFare = baseFare + perKm * distance + perMin * duration;
  const finalFare = Math.max(rawFare, minimumFare);

  res.json({
    vehicle: vehicleData.label,
    city: city.toLowerCase(),
    input: { distance_km: distance, duration_min: duration },
    breakdown: {
      baseFare,
      distanceCharge: parseFloat((perKm * distance).toFixed(2)),
      timeCharge: parseFloat((perMin * duration).toFixed(2)),
      minimumFare
    },
    estimatedFare: parseFloat(finalFare.toFixed(2)),
    currency: "BDT",
    disclaimer:
      "Estimate only, based on publicly reported rate cards. Not official Pathao pricing."
  });
});

app.listen(PORT, () => {
  console.log(`Pathao Fare Estimator API running on port ${PORT}`);
});