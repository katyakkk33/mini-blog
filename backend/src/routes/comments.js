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

function deleteCommentById(commentId, res) {
  const id = Number(commentId);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "invalid comment id" });
  }

  const comment = db
    .prepare("SELECT id, parent_comment_id FROM comments WHERE id = ?")
    .get(id);

  if (!comment) {
    return res.status(404).json({ error: "comment not found" });
  }

  // Delete all replies to this comment (if any)
  db.prepare("DELETE FROM comments WHERE parent_comment_id = ?").run(id);

  // Delete the comment itself
  db.prepare("DELETE FROM comments WHERE id = ?").run(id);

  return res.json({ success: true });
}

// Delete comment (and its replies)
r.delete("/comments/:commentId", (req, res) => {
  return deleteCommentById(req.params.commentId, res);
});

// Alias: support nested URL variant
r.delete("/articles/:id/comments/:commentId", (req, res) => {
  return deleteCommentById(req.params.commentId, res);
});

export default r;
