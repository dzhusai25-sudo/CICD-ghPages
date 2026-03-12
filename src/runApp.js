import './runApp.css';
import { WeatherService } from './services/WeatherService.js';
import { LocationService } from './services/LocationService.js';
import { StorageService } from './services/StorageService.js';
import { WeatherCurrentWidget } from './widgets/WeatherCurrentWidget.js';
import { WeatherSearchWidget } from './widgets/WeatherSearchWidget.js';
import { SearchHistoryWidget } from './widgets/SearchHistoryWidget.js';
import { ErrorWidget } from './widgets/ErrorWidget.js';
import { Router } from './router.js';
//import { EventBus } from './EventBus.js';

export async function runApp(el) {
  el.innerHTML = `
    <div class="weather-app">
      <nav class="navi">
        <a href="/" data-route="/" class="nav-link">Главная</a>
        <a href="/about" data-route="/about" class="nav-link">О приложении</a>
      </nav>
      <div id="currentWidget" class="widget current-weather"></div>
      <h1 class="runApp">Enjoy your weather! 🌞</h1>
      <p class="orNot">... (or not 🌧️)</p>
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

  const errorWidget = new ErrorWidget(errorWidgetContainer);

  const router = new Router();

  router.addRoute('/', async () => {
    try {
      await currentWeatherWidget.render();
      searchHistoryWidget.render();
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
    // Очищаем виджеты погоды и истории
    currentWidgetContainer.innerHTML = '';
    historyWidgetContainer.innerHTML = '';

    // Отображаем контент страницы «О приложении»
    searchWidgetContainer.innerHTML = `
      <div class="about-page">
        <h2>О приложении</h2>
        <p>Это приложение показывает погоду в реальном времени.</p>
        <p>Использует OpenWeatherMap API.</p>
      </div>
    `;
  });

  router.init();

  // Запускаем обработку текущего маршрута
  try {
    await router.handleRoute();
  } catch (error) {
    console.error('Критическая ошибка инициализации:', error);
    eventBus.emit(
      'error',
      'Критическая ошибка. Приложение не может запуститься.',
    );
  }
}
