export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
  }

  addRoute(path, handler) {
    this.routes.set(path, handler);
  }

  async handleRoute(path = window.location.pathname) {
    const route = this.findMatchingRoute(path);
    if (!route) {
      console.warn(`Маршрут "${path}" не найден`);
      return;
    }

    try {
      await route.handler();
      this.currentRoute = path;
      window.history.pushState({}, '', path);
    } catch (error) {
      console.error(`Ошибка при обработке маршрута "${path}":`, error);
      throw error;
    }
  }

  findMatchingRoute(path) {
    // Сначала ищем точное совпадение
    if (this.routes.has(path)) {
      return { path, handler: this.routes.get(path) };
    }

    // Затем ищем wildcard (*)
    if (this.routes.has('*')) {
      return { path: '*', handler: this.routes.get('*') };
    }

    return null;
  }

  init() {
    // Обработчик навигации по ссылкам
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-route]');
      if (link) {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        this.navigate(route);
      }
    });

    // Обработчик кнопки «Назад/Вперёд» в браузере
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });

    // Первоначальная загрузка
    this.handleRoute();
  }

  navigate(path) {
    this.handleRoute(path);
  }
}
