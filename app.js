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
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["set-cookie"],
    })
  );
} else {
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
}
app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith("/")) {
    const query = req.url.slice(req.path.length);
    const safePath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(301, safePath + query);
    return;
  }
  next();
});
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log("Auth:", req.isAuthenticated());
    console.log("Origin:", req.get("origin"));
    next();
  });
}
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cats",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
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
