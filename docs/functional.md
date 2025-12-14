# Dokumentacja funkcjonalna — Mini-blog

## Widoki
1. **Lista artykułów** (`frontend/index.html`)
   - wyświetla listę artykułów (tytuł, autor, fragment treści),
   - umożliwia dodanie nowego artykułu.

2. **Szczegóły artykułu** (`frontend/article.html?id=...`)
   - pełna treść artykułu,
   - lista komentarzy,
   - formularz dodawania komentarza,
   - możliwość dodania odpowiedzi (reply) do komentarza (1 poziom zagnieżdżenia).

## Scenariusze użytkownika
1. Dodawanie artykułu:
   - użytkownik wpisuje tytuł, autora i treść,
   - klika „Zapisz”,
   - artykuł pojawia się na liście.

2. Przeglądanie artykułów:
   - użytkownik widzi listę,
   - klika w tytuł lub „Otwórz”,
   - przechodzi do szczegółów.

3. Dodanie komentarza:
   - w szczegółach artykułu wpisuje autora i treść,
   - klika „Dodaj komentarz”,
   - komentarz pojawia się pod artykułem.

4. Dodanie odpowiedzi na komentarz:
   - pod wybranym komentarzem klika „Odpowiedz”,
   - wpisuje autora i treść odpowiedzi,
   - klika „Dodaj odpowiedź”,
   - odpowiedź pojawia się z wcięciem pod komentarzem.
