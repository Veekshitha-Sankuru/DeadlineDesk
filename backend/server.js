// Local-network DNS workaround: forces Node's resolver to public DNS (8.8.8.8 /
// 1.1.1.1) only when the configured system DNS refuses queries. No-op otherwise.
const ensureDns = require("./dns-fix");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const assignmentRoutes = require("./routes/assignmentRoutes");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables from .env file
dotenv.config();

// Ensure DNS works before connecting (no-op on a healthy network).
ensureDns()
  .then(() => connectDB())
  .catch((err) => {
    console.error("❌ DNS setup error:", err.message);
    connectDB();
  });

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────

// Allow requests from the React frontend.
// Accepts localhost (dev), any *.vercel.app preview URL, and the
// explicit FRONTEND_URL env var set on Render for the production domain.
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      // Allow any Vercel preview/production domain
      if (/\.vercel\.app$/.test(origin)) return callback(null, true);
      // Allow explicitly listed origins
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("CORS: origin not allowed — " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────

// Health check — useful for Render deployment monitoring
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DeadlineDesk API is running",
    timestamp: new Date().toISOString(),
  });
});

// Assignment CRUD routes
app.use("/api/assignments", assignmentRoutes);

// 404 handler — catches routes that don't exist
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Centralized error handler (must be LAST middleware)
app.use(errorHandler);

// ── Start Server ────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 DeadlineDesk server running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});
