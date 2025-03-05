const express = require("express");
const app = express();
const cors = require("cors");
const seedDatabase = require("./models/db/seedDb");

require("dotenv").config();

// Middleware
if (process.env.NODE_ENV === "production") {
  seedDatabase().catch(console.error);
  app.use(
    cors({
      origin:
        process.env.FRONTEND_URL ||
        "https://inventory-application-front-end-taha.vercel.app",
      credentials: true,
    })
  );
} else {
  app.use(cors({ origin: "http://localhost:5173" }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes


// Simple health check route
app.get("/", (req, res) => {
  res.status(200).json({ status: "API is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
