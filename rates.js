// rates.js
// Fare structure modeled on Pathao's publicly reported rate cards.
// These are ESTIMATES for building/learning purposes — not pulled live
// from Pathao and not officially affiliated with Pathao Ltd.
// Update these numbers any time you find more current public rates.

const RATE_CARD = {
  bike: {
    label: "Bike",
    city: {
      dhaka:     { baseFare: 25, perKm: 15,   perMin: 0.5, minimumFare: 50 },
      chattogram:{ baseFare: 25, perKm: 12.5, perMin: 0.5, minimumFare: 40 },
      sylhet:    { baseFare: 25, perKm: 8.5,  perMin: 0.5, minimumFare: 40 }
    }
  },
  cng: {
    label: "CNG",
    city: {
      dhaka:     { baseFare: 40, perKm: 20,   perMin: 0.5, minimumFare: 70 }
    }
  },
  car: {
    label: "Car",
    city: {
      dhaka:     { baseFare: 60, perKm: 30,   perMin: 1.5, minimumFare: 120 }
    }
  }
};

module.exports = RATE_CARD;
