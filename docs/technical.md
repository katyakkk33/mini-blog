# Dokumentacja techniczna — Mini-blog

## Architektura
- **Frontend:** statyczne pliki HTML/CSS/JS, komunikacja z backendem przez `fetch` (REST).
- **Backend:** Node.js + Express, REST API.
- **Baza:** SQLite (plik `backend/data.sqlite`).

## Model danych
### Article
- `id` (PK)
- `title`
- `content`
- `author`
- `created_at`

### Comment
- `id` (PK)
- `article_id` (FK → articles.id)
- `parent_comment_id` (NULL dla komentarza głównego; ustawione dla reply)
- `author`
- `content`
- `created_at`

## Endpointy API
### Artykuły
1) `GET /api/articles`
- opis: lista artykułów
- response: `[{ id, title, excerpt, author, created_at }]`

2) `POST /api/articles`
- opis: dodanie artykułu
- body:
```json
{ "title": "Tytuł", "content": "Treść", "author": "Autor" }
```
- response:
```json
{ "id": 1 }
```

3) `GET /api/articles/:id`
- opis: szczegóły artykułu
- response:
```json
{ "id": 1, "title": "...", "content": "...", "author": "...", "created_at": "..." }
```

### Komentarze i odpowiedzi
4) `GET /api/articles/:id/comments`
- opis: komentarze dla artykułu + odpowiedzi (1 poziom)
- response:
```json
[
  {
    "id": 10,
    "article_id": 1,
    "parent_comment_id": null,
    "author": "Ala",
    "content": "Komentarz…",
    "created_at": "...",
    "replies": [
      { "id": 11, "parent_comment_id": 10, "author": "Ola", "content": "Reply…", "created_at": "..." }
    ]
  }
]
```

5) `POST /api/articles/:id/comments`
- opis: dodanie komentarza głównego
- body:
```json
{ "author": "Ala", "content": "Treść komentarza" }
```
- response:
```json
{ "id": 10 }
```

6) `POST /api/comments/:commentId/replies`
- opis: dodanie odpowiedzi (reply) do komentarza (backend blokuje zagnieżdżanie > 1)
- body:
```json
{ "author": "Ola", "content": "Treść odpowiedzi" }
```
- response:
```json
{ "id": 11 }
```
