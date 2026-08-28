import "dotenv/config";
import express from "express";
import cors from "cors";
import { router as giftsRouter } from "./routes/gifts.js";

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

console.log("Allowed CORS origins:", allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    // Requests without Origin (health checks, server-to-server, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // If no ALLOWED_ORIGINS is configured, allow the request.
    // This is useful while deploying/debugging.
    if (allowedOrigins.length === 0) {
      return callback(null, true);
    }

    // Allow configured frontend origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("CORS blocked origin:", origin);
    return callback(new Error(`CORS blocked: ${origin}`));
  },

  credentials: true,

  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// CORS
app.use(cors(corsOptions));

// JSON body parsing
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// API routes
app.use("/api", giftsRouter);

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 8787;

  app.listen(port, () => {
    console.log(`Raksha Bandhan backend listening on port ${port}`);
  });
}

export default app;
