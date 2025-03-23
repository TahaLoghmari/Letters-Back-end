const express = require("express");
const app = express();
const cors = require("cors");
const seedDatabase = require("./models/db/seedDb");
const session = require("express-session");
const passport = require("passport");

require("dotenv").config();

// Middleware
if (process.env.NODE_ENV === "production") {
  seedDatabase().catch(console.error);
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );
} else {
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
}

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
const loginRouter = require("./routers/loginRouter");
const logoutRouter = require("./routers/logoutRouter");
const signupRouter = require("./routers/signupRouter");
const letterRouter = require("./routers/lettersRouter");
const userRouter = require("./routers/userRouter");

app.use("/api", letterRouter);
app.use("/api", signupRouter);
app.use("/api", loginRouter);
app.use("/api", logoutRouter);
app.use("/api", userRouter);
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
