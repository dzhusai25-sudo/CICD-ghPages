export class Router {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
  }

  addRoute(path, handler) {
    if (path.includes('/*')) {
      path = path.split('/*')[0];
      this.routes.push({
        type: 'param',
        path,
        handler,
      });
    } else {
      this.routes.push({
        type: 'static',
        path,
        handler,
      });
    }
  }

  findMatchingRoute(path) {
    console.log(path);
    // статические маршруты
    const staticRoute = this.routes.find(
      (route) => route.type === 'static' && route.path === path,
    );
    if (staticRoute) {
      return {
        handler: staticRoute.handler,
        params: [],
      };
    }
    // параметризированные маршруты
    for (const route of this.routes) {
      if (route.type === 'param') {
        if (path.startsWith(route.path)) {
          const param = path.slice(route.path.length + 1);

          return {
            handler: route.handler,
            params: [param],
          };
        }
      }
    }
    // *
    const wildcardRoute = this.routes.find((route) => route.path === '*');
    if (wildcardRoute) {
      return {
        handler: wildcardRoute.handler,
        params: [],
      };
    }

    return null;
  }

  async handleRoute(path = window.location.pathname) {
    const matchedRoute = this.findMatchingRoute(path);

    if (!matchedRoute) {
      console.warn(`Маршрут "${path}" не найден`);
      return;
    }

    try {
      await matchedRoute.handler([...matchedRoute.params]);
      this.currentRoute = path;

      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
    } catch (error) {
      console.error(`Ошибка при обработке маршрута "${path}":`, error);
      throw error;
    }
  }

  init() {
    // нави по ссылкам
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-route]');
      if (link) {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        this.navigate(route);
      }
    });

    // Назад/Вперёд
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
