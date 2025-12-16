# Mini-blog — artykuły, komentarze i odpowiedzi

Autorzy: Kateryna Kotovych, Dmytro Halynovych

Mini‑blog to prosta aplikacja webowa (frontend + backend), która umożliwia:
- dodawanie i usuwanie artykułów,
- wyświetlanie listy oraz szczegółów artykułu,
- dodawanie komentarzy,
- dodawanie odpowiedzi na komentarze (1 poziom zagnieżdżenia),
- usuwanie komentarzy (wraz z odpowiedziami).

## Dostęp online

- Render (pełna aplikacja + API): https://mini-blog-d103.onrender.com/
- GitHub Pages (frontend statyczny): https://katyakkk33.github.io/mini-blog/
- Prezentacja: https://gamma.app/docs/Projekt-Zaliczeniowy-Mini-Blog-mejdjuev500c52h
- Wideo (prezentacja): https://youtu.be/p7LUkmXEBh8

Uwaga: GitHub Pages jest statyczny i komunikuje się z API na Render.

## Trwałość danych (ważne)

Backend używa SQLite. Na Render dane będą trwałe tylko wtedy, gdy użyjesz persistent disk.
W przeciwnym razie po redeploy/restarcie instancji artykuły mogą zniknąć (a stare dane „wrócić”).

Rekomendacja dla Render:
- podłącz persistent disk montowany w /var/data
- (opcjonalnie) ustaw DB_PATH=/var/data/data.sqlite

## Uruchomienie lokalne (Windows)

Najszybciej:
1. Zainstaluj Node.js LTS.
2. Uruchom RunAll.bat.

Aplikacja będzie dostępna pod: http://localhost:3000/

## Tryby działania (ważne)

Projekt działa w 3 wariantach:
- Render: backend serwuje frontend i udostępnia API.
- GitHub Pages: statyczny frontend łączy się z API na Render.
- Localhost: backend działa lokalnie.

Żeby dane były zsynchronizowane między Pages/Render/Localhost, frontend na localhost domyślnie korzysta z API na Render.

Jeśli chcesz wymusić lokalną bazę (oddzielne dane), ustaw w przeglądarce:
- localStorage.setItem('api', 'local')

Aby wrócić do synchronizacji z Render:
- localStorage.removeItem('api')

## Start ręczny (opcjonalnie)

Backend:
```bash
cd backend
npm install
npm run dev
```

Sprawdź:
- http://localhost:3000/health
- http://localhost:3000/api/articles

## Startowa strona projektu

Domyślna strona startowa to strona projektowa (pages):
- Render/localhost: /pages
- GitHub Pages: pages.html

Widok aplikacji (lista artykułów) jest dostępny pod:
- /?app=1

## Debug

Dodaj ?debug=1 do URL, aby włączyć panel logów:
- http://localhost:3000/?app=1&debug=1
- http://localhost:3000/article?id=1&debug=1
- https://katyakkk33.github.io/mini-blog/?app=1&debug=1

## API (najważniejsze endpointy)

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

## Struktura projektu

Najważniejsze katalogi:
- backend/src — Express + SQLite + trasy API
- backend/frontend — pliki statyczne serwowane przez backend (Render/localhost)
- css, js oraz index.html/article.html/pages.html — statyczny frontend dla GitHub Pages
