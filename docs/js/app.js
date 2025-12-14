/* frontend/js/app.js (for GitHub Pages) */
// API URL for Render production
const API_URL = 'https://mini-blog-d103.onrender.com/api';


const els = {
  list: document.querySelector("#articles"),
  form: document.querySelector("#newArticleForm"),
  title: document.querySelector("#title"),
  author: document.querySelector("#author"),
  content: document.querySelector("#content"),
  status: document.querySelector("#status"),

  modalOverlay: document.querySelector("#modalOverlay"),
  confirmBtn: document.querySelector("#confirmBtn"),
  cancelBtn: document.querySelector("#cancelBtn"),
};

let idToDelete = null;

const DELETE_ANIM_MS = 500;

function escapeHtml(s) {
  return String(s).replace(/[&<>\"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));
}

function articleUrl(id) {
  return `article.html?id=${encodeURIComponent(String(id))}`;
}

function showModal(id) {
  if (id === null || id === undefined || id === "" || id === "null") {
    alert(`Invalid id (showModal): ${id}`);
    return;
  }

  idToDelete = id;
  els.modalOverlay.classList.remove("hidden");
}

function hideModal() {
  idToDelete = null;
  els.modalOverlay.classList.add("hidden");
}

els.cancelBtn.addEventListener("click", hideModal);

els.modalOverlay.addEventListener("click", (e) => {
  if (e.target === els.modalOverlay) hideModal();
});

els.confirmBtn.addEventListener("click", async () => {
  const raw = idToDelete;
  const idNum = Number(raw);

  if (!Number.isInteger(idNum) || idNum <= 0) {
    alert(`Invalid id (front): ${raw}`);
    return;
  }

  const deleteButtonInList = document.querySelector(`.deleteBtn[data-id="${idNum}"]`);

  hideModal();
  await deleteArticle(idNum, deleteButtonInList);
});

async function loadArticles() {
  try {
    if (!els.list.children.length) {
      els.list.innerHTML = "<p class='muted'>Ładowanie…</p>";
    }

    const res = await fetch(`${API_URL}/articles`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      els.list.innerHTML = "<p class='muted'>Brak artykułów. Dodaj pierwszy 🙂</p>";
      return;
    }

    els.list.innerHTML = data.map((a) => `
      <div class="card" data-id="${a.id}">
        <div class="split">
          <h3>${escapeHtml(a.title)}</h3>
          <span class="muted small">${escapeHtml(a.created_at || "")}</span>
        </div>
        <p class="muted">Autor: ${escapeHtml(a.author)}</p>
        <p>${escapeHtml(a.excerpt || "")}</p>
        <div class="actions">
          <button type="button" class="openBtn" data-id="${a.id}">Otwórz</button>
          <button type="button" class="dangerBtn deleteBtn" data-id="${a.id}">Usuń</button>
        </div>
      </div>
    `).join("");

  } catch (e) {
    console.error(e);
    els.list.innerHTML = "<p class='muted'>Błąd ładowania. Sprawdź backend.</p>";
  }
}

async function deleteArticle(id, btnElement) {
  id = Number(id);
  if (!Number.isInteger(id) || id <= 0) {
    alert(`Invalid id (deleteArticle): ${id}`);
    return;
  }

  try {
    const res = await fetch(`${API_URL}/articles/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || `HTTP ${res.status}`);
    }

    const card = btnElement ? btnElement.closest(".card") : els.list.querySelector(`.card[data-id="${id}"]`);

    if (card) {
      card.classList.add("deleting");

      setTimeout(() => {
        card.remove();

        if (els.list.querySelectorAll(".card").length === 0) {
          loadArticles();
        }
      }, DELETE_ANIM_MS);
    } else {
      await loadArticles();
    }
  } catch (err) {
    alert(err?.message || "Błąd usuwania");
  }
}

els.list.addEventListener("click", (e) => {
  const open = e.target.closest(".openBtn");
  if (open) {
    const id = open.dataset.id;
    location.assign(articleUrl(id));
    return;
  }

  const del = e.target.closest(".deleteBtn");
  if (del) {
    const card = del.closest(".card");
    const id = del.dataset.id || card?.dataset?.id;

    if (!id || id === "null") {
      alert("Invalid id (no data-id on button/card)");
      return;
    }

    showModal(id);
  }
});

els.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  els.status.textContent = "";

  const payload = {
    title: els.title.value.trim(),
    author: els.author.value.trim(),
    content: els.content.value.trim(),
  };

  if (!payload.title || !payload.author || !payload.content) {
    els.status.textContent = "Uzupełnij wszystkie pola.";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || `HTTP ${res.status}`);
    }

    els.form.reset();
    await loadArticles();
  } catch (err) {
    console.error(err);
    els.status.textContent = err?.message || "Błąd podczas zapisu.";
  }
});

loadArticles();
