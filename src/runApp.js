import './runApp.css';
import { WeatherService } from './services/WeatherService.js';
import { LocationService } from './services/LocationService.js';
import { StorageService } from './services/StorageService.js';
import { WeatherCurrentWidget } from './widgets/WeatherCurrentWidget.js';
import { WeatherSearchWidget } from './widgets/WeatherSearchWidget.js';
import { SearchHistoryWidget } from './widgets/SearchHistoryWidget.js';
import { ErrorWidget } from './widgets/ErrorWidget.js';
import { Router } from './router.js';
import { EventBus } from './EventBus.js';

export async function runApp(el) {
  el.innerHTML = `
    <div class="weather-app">
      <nav class="navi">
        <a href="/" data-route="/" class="nav-link">🌤Главная</a>
        <a href="/about" data-route="/about" class="nav-link">ℹ️ О приложении</a>
        <a href="/contacts" data-route="/contacts" class="nav-link">👤Контакты</a>
      </nav>
      <div id="currentWidget" class="widget current-weather"></div>
      <h1 class="runApp"></h1>
      <p class="orNot"></p>
      <div id="searchWidget" class="widget weather-search"></div>
      <div id="errorWidget" class="widget error-display"></div>
      <div id="historyWidget" class="widget search-history"></div>
    </div>
  `;

  const weatherService = new WeatherService('97d93f1704dcb8e35dd2045c8e75710d');
  const locationService = new LocationService();
  const storageService = new StorageService();

  const currentWidgetContainer = el.querySelector('#currentWidget');
  const searchWidgetContainer = el.querySelector('#searchWidget');
  const historyWidgetContainer = el.querySelector('#historyWidget');
  const errorWidgetContainer = el.querySelector('#errorWidget');
  const weatherTitle = el.querySelector('.runApp');
  const weatherSubtitle = el.querySelector('.orNot');

  const currentWeatherWidget = new WeatherCurrentWidget(
    currentWidgetContainer,
    weatherService,
    locationService,
  );

  const weatherSearchWidget = new WeatherSearchWidget(
    searchWidgetContainer,
    weatherService,
    storageService,
  );

  const searchHistoryWidget = new SearchHistoryWidget(
    historyWidgetContainer,
    storageService,
  );

  let errorWidget = null;

  if (errorWidgetContainer) {
    errorWidget = new ErrorWidget(errorWidgetContainer);
  } else {
    console.warn('Контейнер для ErrorWidget не найден на странице');
  }

  const router = new Router();

  router.addRoute('/', async () => {
    try {
      weatherTitle.innerHTML = 'Enjoy your weather! 🌞';
      weatherSubtitle.innerHTML = '... (or not 🌧️)';

      const city = await locationService.getCurrentLocation();
      const weatherData = await weatherService.fetchWeather(city);
      await currentWeatherWidget.render(weatherData);

      weatherSearchWidget.render();
      weatherSearchWidget.bindEvents();
      searchHistoryWidget.render();
      errorWidget.bindEvents();
    } catch (error) {
      console.error('Ошибка:', error);
      EventBus.emit(
        'error',
        'Не удалось загрузить приложение. Проверьте подключение к интернету.',
      );
    }
  });

  // Обработчик страницы «О приложении»
  router.addRoute('/about', () => {
    // Очищаем виджеты и заголовки
    clearContent();

    // Отображаем контент страницы «О приложении»
    searchWidgetContainer.innerHTML = `
      <div class="about-page">
        <h2>О приложении</h2>
        <p>Это приложение показывает погоду в реальном времени.</p>
        <p>Использует OpenWeatherMap API.</p>
      </div>
    `;
  });

  // Обработчик страницы «О приложении»
  router.addRoute('/contacts', () => {
    // Очищаем виджеты и заголовки
    clearContent();

    searchWidgetContainer.innerHTML = `
      <div class="contacts">
        <a href="https://github.com/dzhusai25-sudo" target="_blank">Страница на GitHub</a>
      </div>
    `;
  });

  // Обработчик 404-страницы
  router.addRoute('*', () => {
    clearContent();
    searchWidgetContainer.innerHTML = `
      <div class="error-page">
        <h2>Страница не найдена</h2>
        <p>Запрошенная страница не существует.</p>
        <a href="/">Вернуться на главную</a>
      </div>
    `;
  });

  router.init();

  // Запускаем обработку текущего маршрута
  try {
    await router.handleRoute();
  } catch (error) {
    console.error('Критическая ошибка инициализации:', error);
    EventBus.emit(
      'error',
      'Критическая ошибка. Приложение не может запуститься.',
    );
  }

  // Функция очистки контента
  function clearContent() {
    currentWidgetContainer.innerHTML = '';
    searchWidgetContainer.innerHTML = '';
    historyWidgetContainer.innerHTML = '';
    errorWidgetContainer.innerHTML = '';
    weatherTitle.innerHTML = '';
    weatherSubtitle.innerHTML = '';
  }
}
