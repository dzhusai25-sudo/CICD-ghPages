import { eventBus } from '../EventBus.js';

export class WeatherSearchWidget {
  constructor(container, weatherService, storageService) {
    this.container = container;
    this.weatherService = weatherService;
    this.storageService = storageService;
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="weather-search">
        <input type="text" id="cityInput" placeholder="Enter your city">
        <button id="getWeatherBtn">Get Weather</button>
        <div id="weatherResult"></div>
      </div>
    `;
  }

  bindEvents() {
    this.unsubscribe();
    this.buttonHandler = this.handleSearch.bind(this);
    const button = this.container.querySelector('#getWeatherBtn');
    if (button) {
      button.addEventListener('click', this.buttonHandler);
    }
    this.searchHandler = (city) => this.searchWeather(city);
    eventBus.on('city:selected', this.searchHandler);
  }

  async handleSearch() {
    const city = this.container.querySelector('#cityInput').value.trim();
    if (!city) return;

    await this.searchWeather(city);
  }

  async searchWeather(city) {
    const resultDiv = this.container.querySelector('#weatherResult');
    resultDiv.textContent = 'Загрузка...';

    try {
      const weather = await this.weatherService.fetchWeather(city);
      this.storageService.addCityToHistory(city);

      resultDiv.innerHTML = `
        <div class="weather-card">
          <h4>${weather.name}</h4>
          <p>Температура: ${weather.main.temp}°C</p>
          <p>${weather.weather[0].description}</p>
        </div>
      `;

      eventBus.emit('weather:search:success', { city, weather });
    } catch (error) {
      resultDiv.textContent = '';
      eventBus.emit('error', error.message);
    } finally {
      this.container.querySelector('#cityInput').value = '';
    }
  }

  unsubscribe() {
    eventBus.off('city:selected', this.searchHandler);
    this.searchHandler = null;

    const button = this.container.querySelector('#getWeatherBtn');
    if (button) {
      button.removeEventListener('click', this.buttonHandler);
    }
    this.buttonHandler = null;
  }
}
