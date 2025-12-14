/* frontend/js/article.js (for GitHub Pages) */
// API URL: prefer local relative `/api` when on localhost
const API_URL = (function(){
  try {
    const host = location.hostname;
    if (!host || host === 'localhost' || host === '127.0.0.1') return '/api';
    return 'https://mini-blog-d103.onrender.com/api';
  } catch(e){ return '/api'; }
})();
const qs = new URLSearchParams(location.search);
const articleId = qs.get("id");

const els = {
  title: document.querySelector("#aTitle"),
  meta: document.querySelector("#aMeta"),
  content: document.querySelector("#aContent"),
  comments: document.querySelector("#comments"),
  cForm: document.querySelector("#commentForm"),
  cAuthor: document.querySelector("#cAuthor"),
  cContent: document.querySelector("#cContent"),
  status: document.querySelector("#status"),
};

function escapeHtml(s) {
  return String(s).replace(/[&<>\"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));
}

function commentHtml(c) {
  const replies = (c.replies || []).map((r) => `
    <div class="comment reply">
      <div class="split">
        <strong>${escapeHtml(r.author)}</strong>
        <span class="muted small">${escapeHtml(r.created_at || "")}</span>
      </div>
      <p>${escapeHtml(r.content)}</p>
    </div>
  `).join("");

  return `
    <div class="comment" data-id="${c.id}">
      <div class="split">
        <strong>${escapeHtml(c.author)}</strong>
        <span class="muted small">${escapeHtml(c.created_at || "")}</span>
      </div>
      <p>${escapeHtml(c.content)}</p>

      <div class="actions">
        <button class="small" type="button" data-action="toggleReply">Odpowiedz</button>
      </div>

      <form class="replyForm hidden">
        <div class="row cols2">
          <label>Autor
            <input name="author" placeholder="Twoje imię" required />
          </label>
          <label>Treść odpowiedzi
            <input name="content" placeholder="Napisz odpowiedź…" required />
          </label>
        </div>
        <div class="actions">
          <button type="submit" class="small">Dodaj odpowiedź</button>
          <button type="button" class="small" data-action="cancelReply">Anuluj</button>
        </div>
      </form>

      ${replies}
    </div>
  `;
}

async function loadArticle() {
  const res = await (window.Logger?.apiFetch(`${API_URL}/articles/${articleId}`) ?? fetch(`${API_URL}/articles/${articleId}`));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const a = await res.json();

  els.title.textContent = a.title;
  els.meta.textContent = `Autor: ${a.author} • ${a.created_at || ""}`;
  els.content.textContent = a.content;
}

async function loadComments() {
  els.comments.innerHTML = "<p class='muted'>Ładowanie komentarzy…</p>";

  const res = await (window.Logger?.apiFetch(`${API_URL}/articles/${articleId}/comments`) ?? fetch(`${API_URL}/articles/${articleId}/comments`));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    els.comments.innerHTML = "<p class='muted'>Brak komentarzy. Dodaj pierwszy 🙂</p>";
    return;
  }

  els.comments.innerHTML = data.map(commentHtml).join("");
}

els.cForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  els.status.textContent = "";

  const payload = { author: els.cAuthor.value.trim(), content: els.cContent.value.trim() };
  if (!payload.author || !payload.content) {
    els.status.textContent = "Uzupełnij autora i treść.";
    return;
  }

  try {
    const res = await (window.Logger?.apiFetch(`${API_URL}/articles/${articleId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }) ?? fetch(`${API_URL}/articles/${articleId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }));

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || `HTTP ${res.status}`);
    }

    els.cForm.reset();
    await loadComments();
  } catch (err) {
    console.error(err);
    els.status.textContent = err?.message || "Błяд podczas zapisu komentarza.";
  }
});

els.comments.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const card = e.target.closest(".comment");
  if (!card) return;

  const action = btn.dataset.action;
  const form = card.querySelector(".replyForm");
  if (!form) return;

  if (action === "toggleReply") form.classList.toggle("hidden");
  if (action === "cancelReply") form.classList.add("hidden");
});

els.comments.addEventListener("submit", async (e) => {
  const form = e.target.closest(".replyForm");
  if (!form) return;
  e.preventDefault();

  const card = e.target.closest(".comment");
  const commentId = card?.dataset?.id;
  if (!commentId) return;

  const author = form.querySelector("input[name='author']").value.trim();
  const content = form.querySelector("input[name='content']").value.trim();
  if (!author || !content) return;

  try {
    const res = await (window.Logger?.apiFetch(`${API_URL}/comments/${commentId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, content }),
    }) ?? fetch(`${API_URL}/comments/${commentId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, content }),
    }));

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || `HTTP ${res.status}`);
    }

    await loadComments();
  } catch (err) {
    console.error(err);
    alert(err?.message || "Błąd podczas dodawania odpowiedzi.");
  }
});

async function boot() {
  window.Logger?.log("article.js LOADED ✅", "URL=", location.href);

  if (!articleId) {
    document.body.innerHTML = "<main><p>Brak parametru id.</p><a href='/'>Wróć</a></main>";
    window.Logger?.log("NO articleId in URL");
    return;
  }

  try {
    await loadArticle();
    await loadComments();
  } catch (err) {
    console.error(err);
    document.body.innerHTML = "<main><p>Błąd. Dodaj ?debug=1 i sprawdź log.</p><a href='/'>Wróć</a></main>";
  }
}

boot();

// Language switcher
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    window.i18n.setLang(lang);
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Reload page to apply translations
    location.reload();
  });
  
  // Set initial active button
  if (btn.dataset.lang === window.i18n.getLang()) {
    btn.classList.add('active');
  }
});

// Delete comment handler
els.comments.addEventListener('click', async (e) => {
  if (!e.target.classList.contains('delete-btn')) return;
  
  const card = e.target.closest('.comment');
  const commentId = card?.dataset?.id;
  if (!commentId) return;
  
  if (!confirm('Usunąć ten komentarz?')) return;
  
  try {
    const res = await fetch(`${API_URL}/comments/${commentId}`, {
      method: 'DELETE'
    });
    
    if (!res.ok) {
      throw new Error('Błąd podczas usuwania komentarza');
    }
    
    await loadComments();
  } catch (err) {
    console.error(err);
    alert(err?.message || 'Błąd podczas usuwania komentarza.');
  }
});
