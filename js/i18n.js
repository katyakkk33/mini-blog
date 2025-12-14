/* Translations (PL/UA) */
const translations = {
  pl: {
    title: "Mini-blog",
    subtitle: "Artykuły + komentarze + reply",
    addArticle: "Dodaj artykuł",
    titleLabel: "Tytuł",
    titlePlaceholder: "np. Jak zacząć z…?",
    authorLabel: "Autor",
    authorPlaceholder: "Twoje imię",
    contentLabel: "Treść",
    contentPlaceholder: "Treść artykułu…",
    save: "Zapisz",
    delete: "Usuń",
    cancel: "Anuluj",
    confirm: "Potwierdź",
    deleteConfirm: "Czy na pewno usunąć?",
    deleteConfirmText: "Tej operacji nie można cofnąć. Artykuł i komentarze znikną na zawsze.",
    articleList: "Lista artykułów",
    noArticles: "Brak artykułów. Dodaj pierwszy 🙂",
    comments: "Komentarze",
    noComments: "Brak komentarzy. Dodaj pierwszy 🙂",
    addComment: "Dodaj komentarz",
    reply: "Odpowiedz",
    addReply: "Dodaj odpowiedź",
    loading: "Ładowanie…",
    error: "Błąd",
    back: "← Wróć",
    deleteComment: "Usuń komentarz",
    open: "Otwórz"
  },
  ua: {
    title: "Мініблог",
    subtitle: "Статті + коментарі + відповіді",
    addArticle: "Додати статтю",
    titleLabel: "Заголовок",
    titlePlaceholder: "наприклад, Як почати з…?",
    authorLabel: "Автор",
    authorPlaceholder: "Твоє ім'я",
    contentLabel: "Текст",
    contentPlaceholder: "Текст статті…",
    save: "Зберегти",
    delete: "Видалити",
    cancel: "Скасувати",
    confirm: "Підтвердити",
    deleteConfirm: "Ви впевнені, що хочете видалити?",
    deleteConfirmText: "Цю дію не можна скасувати. Стаття та коментарі зникнуть назавжди.",
    articleList: "Список статей",
    noArticles: "Немає статей. Додайте першу 🙂",
    comments: "Коментарі",
    noComments: "Немає коментарів. Додайте перший 🙂",
    addComment: "Додати коментар",
    reply: "Відповісти",
    addReply: "Додати відповідь",
    loading: "Завантаження…",
    error: "Помилка",
    back: "← Назад",
    deleteComment: "Видалити коментар",
    open: "Відкрити"
  }
};

class I18n {
  constructor() {
    this.lang = localStorage.getItem("lang") || "pl";
  }

  t(key) {
    return translations[this.lang]?.[key] || translations.pl[key] || key;
  }

  setLang(lang) {
    if (translations[lang]) {
      this.lang = lang;
      localStorage.setItem("lang", lang);
      window.location.reload();
    }
  }

  getLang() {
    return this.lang;
  }
}

window.i18n = new I18n();
