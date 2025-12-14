import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { initDb } from "./db.js";
import articlesRouter from "./routes/articles.js";
import commentsRouter from "./routes/comments.js";


initDb();

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files (backend/frontend)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticDir = path.join(__dirname, "..", "frontend");
const htmlDir = path.join(staticDir, "html");
app.use(express.static(staticDir));

// Ensure specific HTML routes work with query params (e.g. /article?id=...)
app.get("/", (req, res) => res.sendFile(path.join(htmlDir, "index.html")));
app.get("/article", (req, res) => res.sendFile(path.join(htmlDir, "article.html")));
app.get("/pages", (req, res) => res.sendFile(path.join(htmlDir, "pages.html")));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.url} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/articles", articlesRouter);
app.use("/api", commentsRouter);

// 404 handler for undefined routes
app.use((req, res) => {
  console.warn(`404: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Not Found" });
});

// Error handler (last)
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message, err.stack);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API on :${port}`);
  console.log(`Static files from: ${staticDir}`);
  console.log(`HTML files from: ${htmlDir}`);
});

