# Dokumentacja funkcjonalna — Mini‑blog

## Cel aplikacji
Aplikacja umożliwia:
- dodawanie artykułów,
- przeglądanie listy artykułów,
- wyświetlanie szczegółów artykułu,
- dodawanie komentarzy pod artykułem,
- dodawanie odpowiedzi na komentarze (1 poziom zagnieżdżenia: komentarz → odpowiedź).

## Widoki / strony

### 1) Strona projektowa (GitHub Pages)
- GitHub Pages: `pages.html`
- Render / localhost (serwowane przez backend): `/pages`

Zawiera: opis, autorów, listę funkcjonalności i wymagane linki.

### 2) Lista artykułów (aplikacja)
- GitHub Pages: `/?app=1`
- Render / localhost: `/?app=1`

Funkcje:
- wyświetla listę artykułów (tytuł, autor, fragment treści),
- pozwala dodać nowy artykuł (tytuł, autor, treść).

### 3) Szczegóły artykułu + komentarze
- GitHub Pages: `article.html?id=<ID>`
- Render / localhost: `/article?id=<ID>`

Funkcje:
- wyświetla pełną treść artykułu,
- pokazuje sekcję komentarzy,
- pozwala dodać komentarz (autor, treść),
- pozwala dodać odpowiedź do komentarza (autor, treść) — tylko 1 poziom zagnieżdżenia.

## Scenariusze użytkownika

### Dodawanie artykułu
1. Wejdź na listę artykułów (`/?app=1`).
2. Wypełnij formularz dodawania artykułu: `title`, `author`, `content`.
3. Zatwierdź — nowy artykuł pojawi się na liście.

### Przeglądanie artykułów
1. Wejdź na listę artykułów (`/?app=1`).
2. Kliknij wybrany artykuł — otworzy się widok szczegółów.

### Dodanie komentarza do artykułu
1. Otwórz szczegóły artykułu (`/article?id=<ID>` lub `article.html?id=<ID>`).
2. Wypełnij formularz komentarza: `author`, `content`.
3. Zatwierdź — komentarz pojawi się pod artykułem.

### Dodanie odpowiedzi na komentarz
1. W widoku artykułu znajdź komentarz.
2. Kliknij/działaj w sekcji odpowiedzi i dodaj `author` oraz `content`.
3. Zatwierdź — odpowiedź pojawi się pod komentarzem z wcięciem.

## Ograniczenia
- Dozwolony jest tylko 1 poziom zagnieżdżenia odpowiedzi (odpowiedź nie może mieć własnych odpowiedzi).
- Brak logowania — autor to zwykłe pole tekstowe.
