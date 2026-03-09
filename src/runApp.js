import './runApp.css';
import { WeatherService } from './services/WeatherService.js';
import { LocationService } from './services/LocationService.js';
import { StorageService } from './services/StorageService.js';
import { WeatherCurrentWidget } from './widgets/WeatherCurrentWidget.js';
import { WeatherSearchWidget } from './widgets/WeatherSearchWidget.js';
import { SearchHistoryWidget } from './widgets/SearchHistoryWidget.js';
import { ErrorWidget } from './widgets/ErrorWidget.js';

export async function runApp(el) {
  el.innerHTML = `
    <div class="weather-app">
      <div id="currentWidget" class="widget current-weather"></div>
      <h1 class="runApp">Enjoy your weather!</h1>
      <h1 class="runApp">... (or not)</h1>
      <div id="searchWidget" class="widget weather-search"></div>
      <div id="historyWidget" class="widget search-history"></div>
      <div id="errorWidget" class="widget error-display"></div>
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

  try {
    await currentWeatherWidget.render();
  } catch (error) {
    console.error('Ошибка:', error);
    eventBus.emit(
      'error',
      'Не удалось загрузить приложение. Проверьте подключение к интернету.',
    );
  }
}
