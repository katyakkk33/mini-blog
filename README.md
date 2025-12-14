# Mini-blog: artykuły + komentarze + odpowiedzi

**Autorzy:** Kateryna Kotovych, Dmytro Halynovych

Prosta aplikacja webowa (frontend + backend) umożliwiająca:
- dodawanie artykułów,
- listę artykułów,
- widok szczegółów artykułu,
- dodawanie komentarzy,
- dodawanie odpowiedzi na komentarze (1 poziom zagnieżdżenia).

## 🚀 Dostęp online

| Platforma | URL |
|-----------|-----|
| **Render** (Backend API) | https://mini-blog-d103.onrender.com |
| **GitHub Pages** | https://katyakkk33.github.io/mini-blog/ |

Obie wersje działają na tym samym Render API, różnica tylko w hostingu frontendu.

## 🏃 Najszybszy start (Windows - lokalne)

1. Zainstaluj **Node.js LTS**.
2. Uruchom **`RunAll.bat`** (dwuklik).

Skrypt automatycznie:
- zainstaluje zależności backendu (jeśli trzeba),
- uruchomi API na `http://localhost:3000`.

Frontend jest wtedy dostępny na `http://localhost:3000` (serwer obsługuje zarówno API jak i statyczne pliki).

## 📁 Struktura projektu

```
mini-blog/
├── backend/
│   ├── src/
│   │   ├── app.js (Express server)
│   │   ├── db.js (SQLite)
│   │   ├── schema.sql
│   │   └── routes/
│   │       ├── articles.js
│   │       └── comments.js
│   ├── frontend/ ← Statyczne pliki (HTML/CSS/JS) dla Render
│   │   ├── css/styles.css
│   │   ├── js/app.js, article.js, logger.js, debug.js
│   │   └── html/index.html, article.html, pages.html
│   └── package.json
├── docs/ ← Kopia dla GitHub Pages
│   ├── index.html, article.html, pages.html
│   ├── css/styles.css
│   └── js/...
├── RunAll.bat (uruchomienie lokalne)
├── StopAll.bat (zatrzymanie)
└── README.md
```

## 🔧 Ręczne uruchomienie (jeśli potrzebne)

### Backend (API)
```bash
cd backend
npm install
npm run dev
```

Sprawdź:
- `http://localhost:3000/health`
- `http://localhost:3000/api/articles`

### Dostęp do frontendu
- Backend automatycznie obsługuje `/` → zwraca `index.html`
- API dostępne na `/api/*`
- Statyczne pliki (`/css/*`, `/js/*`) obsługiwane przez `express.static()`

## 🐛 Debug log

Dodaj `?debug=1` do adresu (aktywuje panel na dole):
```
http://localhost:3000/?debug=1
http://localhost:3000/article?id=1&debug=1
https://katyakkk33.github.io/mini-blog/?debug=1
```

## 📝 Zmienne środowiska

Backend aktualizuje się automatycznie dla obu dekomentów.

**Lokalne**: API URL na Render (hardcoded w JS)
**GitHub Pages**: API URL na Render (hardcoded w JS w `/docs/`)
**Render**: Obsługuje zarówno API jak i frontend

## Linki (do uzupełnienia)
- Działająca aplikacja: TODO
- GitHub Pages: TODO
- Repozytorium Git: TODO
- Prezentacja PDF: TODO
- Wideo: TODO
