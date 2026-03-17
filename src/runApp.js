import './runApp.css';
import { WeatherService } from './services/WeatherService.js';
import { LocationService } from './services/LocationService.js';
import { StorageService } from './services/StorageService.js';
import { WeatherCurrentWidget } from './widgets/WeatherCurrentWidget.js';
import { WeatherSearchWidget } from './widgets/WeatherSearchWidget.js';
import { SearchHistoryWidget } from './widgets/SearchHistoryWidget.js';
import { ErrorWidget } from './widgets/ErrorWidget.js';
import { Router } from './router.js';
import { eventBus } from './EventBus.js';

export async function runApp(el) {
  const basePath = PRODUCTION ? '/CICD-ghPages' : '';
  
  el.innerHTML = `
    <div class="weather-app">
      <nav class="navi">
      <p>
        <a href="/" data-route="/" class="nav-link">🌤 Главная</a>
        <a href="/weather/Moscow" data-route="/weather/Moscow" class="nav-link">🏛 Москва</a>
        <a href="/weather/New%20York" data-route="/weather/New%20York" class="nav-link">🗽 Нью-Йорк</a>
      </p>
        <a href="/about" data-route="/about" class="nav-link">ℹ️ О приложении</a>
        <a href="/contacts" data-route="/contacts" class="nav-link">👤 Контакты</a>
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

  async function displayWeatherForCity(city) {
    try {
      clearContent();
      const decodedCity = decodeURIComponent(city);
      const currenCity = await locationService.getCurrentLocation();
      const weatherData = await weatherService.fetchWeather(currenCity);

      weatherTitle.innerHTML = 'Enjoy your weather! 🌞';
      weatherSubtitle.innerHTML = '... (or not 🌧️)';
      weatherSearchWidget.render();
      weatherSearchWidget.bindEvents();
      searchHistoryWidget.render();

      await currentWeatherWidget.render(weatherData);
      await weatherSearchWidget.searchWeather(decodedCity);

      if (errorWidget && errorWidget.bindEvents) {
        errorWidget.bindEvents();
      }
    } catch (error) {
      console.error(`Ошибка загрузки погоды для города ${city}:`, error);
      eventBus.emit(
        'error',
        `Не удалось загрузить погоду для города ${decodeURIComponent(city)}`,
      );
    }
  }

  const router = new Router(basePath);

  router.addRoute('/', async () => {
    try {
      clearContent();
      weatherTitle.innerHTML = 'Enjoy your weather! 🌞';
      weatherSubtitle.innerHTML = '... (or not 🌧️)';

      const city = await locationService.getCurrentLocation();
      const weatherData = await weatherService.fetchWeather(city);
      await currentWeatherWidget.render(weatherData);

      weatherSearchWidget.render();
      weatherSearchWidget.bindEvents();
      searchHistoryWidget.render();

      if (errorWidget) {
        errorWidget.bindEvents();
      }
    } catch (error) {
      console.error('Ошибка:', error);
      eventBus.emit(
        'error',
        'Не удалось загрузить приложение. Проверьте подключение к интернету.',
      );
    }
  });

  router.addRoute('/weather/*', async (city) => {
    clearContent();
    await displayWeatherForCity(city);
  });

  router.addRoute('/about', () => {
    clearContent();

    searchWidgetContainer.innerHTML = `
      <div class="about-page">
        <h2>О приложении</h2>
        <p>Это приложение показывает погоду в реальном времени.</p>
        <p>Использует OpenWeatherMap API.</p>
      </div>
    `;
  });

  router.addRoute('/contacts', () => {
    clearContent();

    searchWidgetContainer.innerHTML = `
      <div class="contacts-page">
        <h2>Контакты</h2>
        <a href="https://github.com/dzhusai25-sudo" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    `;
  });

  router.addRoute('*', () => {
    clearContent();

    searchWidgetContainer.innerHTML = `
      <div class="error-page">
        <h2>404 - Страница не найдена</h2>
        <p>Запрошенная страница не существует.</p>
        <p>Попробуйте перейти по одному из существующих маршрутов:</p>
        <ul>
          <li><a href="/" data-route="/">Главная</a></li>
          <li><a href="/about" data-route="/about">О приложении</a></li>
          <li><a href="/contacts" data-route="/contacts">Контакты</a></li>
          <li><a href="/weather/Moscow" data-route="/weather/Moscow">Погода в Москве</a></li>
          <li><a href="/weather/Tomsk" data-route="/weather/Tomsk">Погода в Томске</a></li>
          <li><a href="/weather/Paris" data-route="/weather/Paris">Погода в Париже</a></li>
        </ul>
      </div>
    `;
  });

  router.init();

  function clearContent() {
    const contents = [
      currentWidgetContainer,
      searchWidgetContainer,
      historyWidgetContainer,
      errorWidgetContainer,
      weatherTitle,
      weatherSubtitle,
    ];

    contents.forEach((content) => {
      if (content) {
        content.innerHTML = '';
      }
    });
  }
}
