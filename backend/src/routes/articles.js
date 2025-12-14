import { Router } from "express";
import { db } from "../db.js";

const router = Router();

/* LIST */
router.get("/", (req, res) => {
  const rows = db.prepare(`
    SELECT id, title, author,
    substr(content, 1, 120) || '…' AS excerpt,
    created_at
    FROM articles
    ORDER BY id DESC
  `).all();

  res.json(rows);
});

/* CREATE */
router.post("/", (req, res) => {
  const { title, author, content } = req.body || {};
  if (!title || !author || !content) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const info = db.prepare(`
    INSERT INTO articles (title, author, content)
    VALUES (?, ?, ?)
  `).run(title, author, content);

  res.json({ id: info.lastInsertRowid });
});

/* GET ONE */
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare(`SELECT * FROM articles WHERE id = ?`).get(id);
  if (!row) return res.status(404).json({ error: "Article not found" });
  res.json(row);
});

/* UPDATE */
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, author, content } = req.body || {};

  if (!title || !author || !content) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const info = db.prepare(`
    UPDATE articles
    SET title = ?, author = ?, content = ?
    WHERE id = ?
  `).run(title, author, content, id);

  if (info.changes === 0) {
    return res.status(404).json({ error: "Article not found" });
  }

  res.json({ ok: true });
});

/* DELETE */
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: `Invalid id: ${req.params.id}` });
  }
 


  // 1) usuń replies
  db.prepare(`
    DELETE FROM comments
    WHERE parent_comment_id IN (
      SELECT id FROM comments WHERE article_id = ?
    )
  `).run(id);

  // 2) usuń komentarze
  db.prepare(`DELETE FROM comments WHERE article_id = ?`).run(id);

  // 3) usuń artykuł
  const info = db.prepare(`DELETE FROM articles WHERE id = ?`).run(id);

  if (info.changes === 0) {
    return res.status(404).json({ error: "Article not found" });
  }

  res.json({ ok: true });
});

export default router;
