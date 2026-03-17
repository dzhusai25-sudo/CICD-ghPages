export class Router {
  constructor(basePath = '') {
    this.routes = [];
    this.currentRoute = null;
    this.basePath = basePath.replace(/\/$/, '');
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

    getFullPath(path) {
    return this.basePath + (path.startsWith('/') ? path : '/' + path);
  }

  async handleRoute(path = this.getCurrentPathWithoutBase()) {
    const matchedRoute = this.findMatchingRoute(path);

    if (!matchedRoute) {
      console.warn(`Маршрут "${path}" не найден`);
      return;
    }

    try {
      await matchedRoute.handler([...matchedRoute.params]);
      this.currentRoute = path;

      const fullPath = this.getFullPath(path);
      if (window.location.pathname !== fullPath) {
        window.history.pushState({}, '', fullPath);
      }
    } catch (error) {
      console.error(`Ошибка при обработке маршрута "${path}":`, error);
      throw error;
    }
  }

  getCurrentPathWithoutBase() {
    let path = window.location.pathname;
    
    if (this.basePath && path.startsWith(this.basePath)) {
      path = path.slice(this.basePath.length) || '/';
    }
    return path;
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
    if (this.basePath && path.startsWith(this.basePath)) {
      path = path.slice(this.basePath.length) || '/';
    }
    this.handleRoute(path);
  }
}
