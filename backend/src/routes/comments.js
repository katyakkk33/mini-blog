import { Router } from "express";
import { db } from "../db.js";

const r = Router();

r.get("/articles/:id/comments", (req, res) => {
  const articleId = Number(req.params.id);

  const all = db.prepare(
    `SELECT id, article_id, parent_comment_id, author, content, created_at
     FROM comments
     WHERE article_id = ?
     ORDER BY id ASC`
  ).all(articleId);

  const byParent = new Map(); // parentId -> []
  for (const c of all) {
    const key = c.parent_comment_id ?? 0;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(c);
  }

  const roots = byParent.get(0) || [];
  const result = roots.map(c => ({
    ...c,
    replies: (byParent.get(c.id) || []).map(rp => ({ ...rp }))
  }));

  res.json(result);
});

r.post("/articles/:id/comments", (req, res) => {
  const articleId = Number(req.params.id);
  const { author, content } = req.body || {};
  if (!author?.trim() || !content?.trim()) {
    return res.status(400).json({ error: "author and content are required" });
  }

  const info = db.prepare(
    "INSERT INTO comments (article_id, parent_comment_id, author, content) VALUES (?, NULL, ?, ?)"
  ).run(articleId, author.trim(), content.trim());

  res.status(201).json({ id: info.lastInsertRowid });
});

r.post("/comments/:commentId/replies", (req, res) => {
  const parentId = Number(req.params.commentId);
  const { author, content } = req.body || {};
  if (!author?.trim() || !content?.trim()) {
    return res.status(400).json({ error: "author and content are required" });
  }

  const parent = db.prepare(
    "SELECT id, article_id, parent_comment_id FROM comments WHERE id = ?"
  ).get(parentId);

  if (!parent) return res.status(404).json({ error: "parent comment not found" });
  if (parent.parent_comment_id !== null) {
    return res.status(400).json({ error: "only 1 level of nesting allowed" });
  }

  const info = db.prepare(
    "INSERT INTO comments (article_id, parent_comment_id, author, content) VALUES (?, ?, ?, ?)"
  ).run(parent.article_id, parentId, author.trim(), content.trim());

  res.status(201).json({ id: info.lastInsertRowid });
});

export default r;
