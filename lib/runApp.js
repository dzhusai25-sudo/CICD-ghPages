"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runApp = runApp;
require("./runApp.css");
const WeatherService_1 = require("./services/WeatherService");
const LocationService_1 = require("./services/LocationService");
const StorageService_1 = require("./services/StorageService");
const WeatherCurrentWidget_1 = require("./widgets/WeatherCurrentWidget");
const WeatherSearchWidget_1 = require("./widgets/WeatherSearchWidget");
const SearchHistoryWidget_1 = require("./widgets/SearchHistoryWidget");
const ErrorWidget_1 = require("./widgets/ErrorWidget");
const Router_1 = require("./Router");
const EventBus_1 = require("./EventBus");
async function runApp(el) {
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
    const weatherService = new WeatherService_1.WeatherService('97d93f1704dcb8e35dd2045c8e75710d');
    const locationService = new LocationService_1.LocationService();
    const storageService = new StorageService_1.StorageService();
    const currentWidgetContainer = el.querySelector('#currentWidget');
    const searchWidgetContainer = el.querySelector('#searchWidget');
    const historyWidgetContainer = el.querySelector('#historyWidget');
    const errorWidgetContainer = el.querySelector('#errorWidget');
    const weatherTitle = el.querySelector('.runApp');
    const weatherSubtitle = el.querySelector('.orNot');
    const currentWeatherWidget = new WeatherCurrentWidget_1.WeatherCurrentWidget(currentWidgetContainer, weatherService, locationService);
    const weatherSearchWidget = new WeatherSearchWidget_1.WeatherSearchWidget(searchWidgetContainer, weatherService, storageService);
    const searchHistoryWidget = new SearchHistoryWidget_1.SearchHistoryWidget(historyWidgetContainer, storageService);
    let errorWidget = null;
    if (errorWidgetContainer) {
        errorWidget = new ErrorWidget_1.ErrorWidget(errorWidgetContainer);
    }
    else {
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
        }
        catch (error) {
            console.error(`Ошибка загрузки погоды для города ${city}:`, error);
            EventBus_1.eventBus.emit('error', `Не удалось загрузить погоду для города ${decodeURIComponent(city)}`);
        }
    }
    const router = new Router_1.Router(basePath);
    EventBus_1.eventBus.on('city:search', (city) => {
        router.navigate(`/weather/${encodeURIComponent(city)}`);
    });
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
        }
        catch (error) {
            console.error('Ошибка:', error);
            EventBus_1.eventBus.emit('error', 'Не удалось загрузить приложение. Проверьте подключение к интернету.');
        }
    });
    router.addRoute('/weather/*', async (params) => {
        const city = params[0];
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
//# sourceMappingURL=runApp.js.map