# Dokumentacja techniczna — Mini‑blog

## Architektura (high‑level)
Projekt składa się z:
- **Frontend**: statyczne pliki HTML/CSS/JS (vanilla)
  - dla GitHub Pages: katalog główny repo (`index.html`, `article.html`, `pages.html`, `css/`, `js/`)
  - dla Render/localhost: kopia serwowana przez backend z `backend/frontend`
- **Backend**: Node.js + Express (`backend/src/app.js`)
- **Baza danych**: SQLite (plik) przez `better-sqlite3`

Backend udostępnia API REST i (na Render/localhost) serwuje też frontend.

## Hosting / warianty uruchomienia
- **Render**: backend + API + frontend (serwowany przez backend)
- **GitHub Pages**: tylko frontend statyczny; łączy się z API na Render
- **Localhost**: backend lokalnie; frontend na localhost domyślnie może korzystać z API na Render (synchronizacja danych)

## Model danych

### Tabela `articles`
- `id` (INTEGER, PK)
- `title` (TEXT)
- `content` (TEXT)
- `author` (TEXT)
- `created_at` (TEXT, domyślnie `datetime('now')`)

### Tabela `comments`
- `id` (INTEGER, PK)
- `article_id` (INTEGER, FK → `articles.id`)
- `parent_comment_id` (INTEGER NULL, FK → `comments.id`)
- `author` (TEXT)
- `content` (TEXT)
- `created_at` (TEXT)

Relacja odpowiedzi:
- komentarz główny: `parent_comment_id = NULL`
- odpowiedź: `parent_comment_id = <id komentarza głównego>`
- aplikacja ogranicza zagnieżdżenie do **1 poziomu** (odpowiedź nie może być rodzicem kolejnych odpowiedzi).

## API — endpointy

### Health
- `GET /health` → `{ "ok": true }`

### Artykuły

#### `GET /api/articles`
Zwraca listę artykułów (z fragmentem treści):
```json
[
  {
    "id": 3,
    "title": "Tytuł",
    "author": "Autor",
    "excerpt": "Pierwsze 120 znaków…",
    "created_at": "2025-12-16 12:00:00"
  }
]
```

#### `POST /api/articles`
Body:
```json
{ "title": "Tytuł", "author": "Autor", "content": "Pełna treść" }
```
Response:
```json
{ "id": 123 }
```

#### `GET /api/articles/:id`
Response (pełny artykuł):
```json
{ "id": 1, "title": "...", "author": "...", "content": "...", "created_at": "..." }
```

#### `PUT /api/articles/:id`
Body:
```json
{ "title": "...", "author": "...", "content": "..." }
```
Response:
```json
{ "ok": true }
```

#### `DELETE /api/articles/:id`
Response:
```json
{ "ok": true }
```

### Komentarze

#### `GET /api/articles/:id/comments`
Zwraca komentarze główne z polem `replies` (1 poziom):
```json
[
  {
    "id": 10,
    "article_id": 1,
    "parent_comment_id": null,
    "author": "Ala",
    "content": "Komentarz",
    "created_at": "...",
    "replies": [
      {
        "id": 11,
        "article_id": 1,
        "parent_comment_id": 10,
        "author": "Ola",
        "content": "Odpowiedź",
        "created_at": "..."
      }
    ]
  }
]
```

#### `POST /api/articles/:id/comments`
Body:
```json
{ "author": "Ala", "content": "Treść" }
```
Response:
```json
{ "id": 10 }
```

#### `POST /api/comments/:commentId/replies`
Body:
```json
{ "author": "Ola", "content": "Odpowiedź" }
```
Response:
```json
{ "id": 11 }
```
Uwaga: jeśli `commentId` wskazuje na odpowiedź (a nie komentarz główny), API zwróci błąd (1 poziom zagnieżdżenia).

#### `DELETE /api/comments/:commentId`
Usuwa komentarz i jego odpowiedzi (jeśli istnieją):
```json
{ "success": true }
```

## Trwałość danych (Render)
SQLite jest plikiem. Na Render dane będą trwałe tylko przy użyciu persistent disk (np. montowanie `/var/data`).
W razie potrzeby ustaw zmienną środowiskową:
- `DB_PATH=/var/data/data.sqlite`
