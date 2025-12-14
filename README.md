# Mini-blog: artykuły + komentarze + odpowiedzi

Prosta aplikacja webowa (frontend + backend) umożliwiająca:
- dodawanie artykułów,
- listę artykułów,
- widok szczegółów artykułu,
- dodawanie komentarzy,
- dodawanie odpowiedzi na komentarze (1 poziom zagnieżdżenia).

## Najszybszy start (Windows)
1. Zainstaluj **Node.js LTS**.
2. Uruchom **`RunAll.bat`** (dwuklik).

Skrypt:
- zainstaluje zależności backendu (jeśli trzeba),
- uruchomi API na `http://localhost:3000`,
- uruchomi frontend na `http://localhost:5173`.

> Frontend to statyczne pliki (HTML/CSS/JS) — **nie ma `package.json`** i nie uruchamia się przez `npm run dev`.

## Ręczne uruchomienie (gdyby było potrzebne)

### Backend (API)
```bash
cd backend
npm install
npm run dev
```

Sprawdź:
- `http://localhost:3000/health`
- `http://localhost:3000/api/articles`

### Frontend (statycznie)
Z katalogu głównego projektu:
```bash
npx --yes serve frontend -l 5173
```

## Użycie
- Lista artykułów: `http://localhost:5173/`
- Widok artykułu: `http://localhost:5173/article?id=ID`  
  (celowo **bez** `article.html?id=...`, żeby serwer statyczny nie gubił parametru `id`)

## Debug log (panel na dole)
Dodaj `?debug=1` do adresu:
- `http://localhost:5173/?debug=1`
- `http://localhost:5173/article?id=1&debug=1`

## Linki (do uzupełnienia przed oddaniem)
- Działająca aplikacja: TODO
- GitHub Pages: TODO
- Repozytorium Git: TODO
- Prezentacja PDF: TODO
- Wideo: TODO
