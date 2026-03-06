import './runApp.css';
import { WeatherService } from './services/WeatherService.js';
import { LocationService } from './services/LocationService.js';
import { StorageService } from './services/StorageService.js';

function renderSearchHistory(el, StorageService) {
  const history = StorageService.getHistory();
  if (history.length === 0) {
    el.innerHTML = '<p>История поиска пуста</p>';
    return;
  }
  el.innerHTML = `
    <div class="search-history">
      <h4>Последние 10 городов:</h4>
      <ul>
        ${history.map((city) => `<li>${city}</li>`).join('')}
      </ul>
    </div>
  `;
}

export async function runApp(el) {
  //Разметка
  el.innerHTML = `
    <div class="weather-app">
    <h1 id="currentWeather" class="current-weather">Загрузка текущей погоды...</h1>
      <h1 class="runApp">Enjoy your weather!</h1>
      <h1 class="runApp">... (or not)</h1>
      <input
        id="cityInput"
        placeholder="Enter your city"
        aria-label="City name"
      />
      <button id="getWeatherButton" type="button">Get Weather</button>
      <div id="weatherResult" class="weather-result"></div>
      <div id="searchHistory" class="search-history-container"></div>
    </div>
  `;

  const weatherService = new WeatherService('97d93f1704dcb8e35dd2045c8e75710d');
  const locationService = new LocationService();
  const storageService = new StorageService();

  //Блок констант
  const input = el.querySelector('#cityInput');
  const button = el.querySelector('#getWeatherButton');
  const resultDiv = el.querySelector('#weatherResult');
  const historyDiv = el.querySelector('#searchHistory');
  const currentWeatherDiv = el.querySelector('#currentWeather');
  const API_ID = '97d93f1704dcb8e35dd2045c8e75710d';

  //Отображение погоды по гео
  try {
    const currentCity = await locationService.getCurrentLocation();
    const currentWeatherData = await weatherService.fetchWeather(currentCity);
    currentWeatherDiv.innerHTML = `Погода в городе ${currentCity}: ${currentWeatherData.main.temp} °C`;
  } catch (error) {
    currentWeatherDiv.innerHTML = `Не удалось загрузить текущую погоду: ${error.message}`;
    console.error('Ошибка загрузки текущей погоды:', error);
  }

  //Отображение истории запросов
  renderSearchHistory(historyDiv, storageService);

  //Обработчик клика
  button.addEventListener('click', async () => {
    const city = input.value.trim();

    if (!city) {
      alert('Пожалуйста, введите название Вашего города');
      return;
    }

    // Loading...
    resultDiv.textContent = 'Загрузка...';
    button.disabled = true;

    try {
      const data = await weatherService.fetchWeather(city);

      storageService.addCityToHistory(city);

      input.value = '';

      resultDiv.innerHTML = `
        <div class="weather-card">
          <h2>${data.name}, ${data.sys.country}</h2>
          <p><strong>Температура:</strong> ${data.main.temp} °C</p>
          <p><strong>Ощущается как:</strong> ${data.main.feels_like} °C</p>
          <p><strong>Влажность:</strong> ${data.main.humidity}%</p>
          <p><strong>Давление:</strong> ${data.main.pressure} гПа</p>
          <p><strong>Погода:</strong> ${data.weather[0].description}</p>
        </div>
      `;

      renderSearchHistory(historyDiv, storageService);
    } catch (error) {
      resultDiv.innerHTML = `
        <div class="error-message">
          <strong>Ошибка:</strong> ${error.message}
        </div>
      `;
      console.error('Ошибка запроса погоды:', error);
    } finally {
      button.disabled = false;
    }
  });
}
