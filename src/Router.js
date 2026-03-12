export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.init();
  }

  // Добавление маршрута с валидацией
  addRoute(path, handler) {
    if (this.routes.has(path)) {
      console.warn(`Маршрут "${path}" уже существует. Перезапись.`);
    }
    this.routes.set(path, handler);
  }

  // Переход на маршрут
  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute();
  }

  // Обработка текущего маршрута с ожиданием асинхронных операций
  async handleRoute() {
    const path = window.location.pathname;
    const handler = this.routes.get(path);

    try {
      if (handler) {
        // Очистка предыдущего маршрута
        if (this.currentRoute) {
          this.currentRoute.cleanup?.();
        }

        this.currentRoute = { path, handler };

        // Ожидание завершения асинхронного обработчика
        await handler();

        // Событие успешной навигации
        this._emitEvent('routeChange', { path });
      } else {
        // Вызов обработчика 404 вместо жёсткого редиректа
        const notFoundHandler = this.routes.get('/404');
        if (notFoundHandler) {
          await notFoundHandler();
        } else {
          console.error(`Маршрут "${path}" не найден.`);
          this._emitEvent('routeNotFound', { path });
        }
      }
    } catch (error) {
      console.error('Ошибка при обработке маршрута:', error);
      this._emitEvent('routeError', { path, error });
    }
  }

  // Инициализация роутера
  init() {
    // Обработка навигации через history API
    window.addEventListener('popstate', () => this.handleRoute());

    // Делегирование кликов по ссылкам с data-route (только в пределах навигационного контейнера)
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-route]');
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        this.navigate(href);
      }
    });

    // Первоначальная обработка маршрута
    this.handleRoute();
  }

  // Вспомогательный метод для эмита событий
  _emitEvent(eventName, detail) {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
  }

  // Метод для удаления маршрута
  removeRoute(path) {
    this.routes.delete(path);
    if (this.currentRoute?.path === path) {
      this.currentRoute = null;
    }
  }

  // Получение текущего пути
  getCurrentPath() {
    return window.location.pathname;
  }
}
