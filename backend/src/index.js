import "dotenv/config";
import express from "express";
import cors from "cors";
import { router as giftsRouter } from "./routes/gifts.js";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : [];

// 1. ADDED THIS EXPLICIT MIDDLEWARE RIGHT AT THE TOP FOR VERCEL PREFLIGHTS
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Validate origin based on your logic
  if (
    !origin ||
    allowedOrigins.includes(origin) ||
    allowedOrigins.length === 0
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );

  // IMMEDIATELY terminate OPTIONS requests with a clean 204 status so Vercel doesn't block them
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

// 2. Keep standard cors fallback config below it
app.use(
  cors({
    origin: (origin, cb) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.length === 0
      ) {
        cb(null, true);
      } else {
        cb(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api", giftsRouter);

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 8787;
  app.listen(port, () => {
    console.log(`Raksha Bandhan backend listening on port ${port}`);
  });
}

export default app;