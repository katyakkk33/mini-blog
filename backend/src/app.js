import express from "express";
import cors from "cors";
import { initDb } from "./db.js";
import articlesRouter from "./routes/articles.js";
import commentsRouter from "./routes/comments.js";


initDb();

const app = express();
app.use(cors());
app.use(express.json());

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

// Error handler (last)
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API on :${port}`));

