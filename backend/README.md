# Backend — Mini‑blog (Express + SQLite)

Backend udostępnia REST API oraz serwuje statyczny frontend z katalogu backend/frontend.

Wideo (prezentacja): https://youtu.be/p7LUkmXEBh8

## Uruchomienie

```bash
npm install
npm run dev
```

Domyślnie serwer startuje na porcie 3000.

## Endpointy

Health:
- GET /health

Artykuły:
- GET /api/articles
- POST /api/articles
- GET /api/articles/:id
- DELETE /api/articles/:id

Komentarze:
- GET /api/articles/:id/comments
- POST /api/articles/:id/comments
- POST /api/comments/:commentId/replies
- DELETE /api/comments/:commentId

## Frontend (serwowany przez backend)

Pliki statyczne:
- backend/frontend/css
- backend/frontend/js
- backend/frontend/html

Ważne ścieżki:
- / (HTML)
- /article (HTML)
- /pages (HTML)
- /css/*, /js/* (statyczne)

## Baza danych

SQLite domyślnie jest trzymany w pliku (lokalnie):
- backend/data.sqlite

Na Render (jeśli ustawiona jest zmienna RENDER) backend domyślnie używa:
- /var/data/data.sqlite

Żeby dane nie znikały po redeploy/restarcie na Render, trzeba podłączyć persistent disk montowany w /var/data.

Możesz zmienić lokalizację przez zmienną środowiskową:
- DB_PATH
