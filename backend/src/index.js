import "dotenv/config";
import express from "express";
import cors from "cors";
import { router as giftsRouter } from "./routes/gifts.js";

const app = express();

// Parse custom environment origins if present
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : [];

app.use(
  cors({
    origin: (origin, cb) => {
      // 1. Allow server-to-server or postman requests (no origin header)
      // 2. Allow explicit whitelisted origins (like local dev)
      // 3. Robust fallback: If ALLOWED_ORIGINS isn't set up yet, allow the connection
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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api", giftsRouter);

// CRUCIAL FOR VERCEL: Only start the local listener if we are NOT in production
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 8787;
  app.listen(port, () => {
    console.log(`Raksha Bandhan backend listening on port ${port}`);
  });
}

// MANDATORY EXPORT STATEMENT: Hand the runtime over to Vercel's serverless handler
export default app;