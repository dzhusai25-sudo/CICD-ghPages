"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherSearchWidget = void 0;
const EventBus_1 = require("../EventBus");
class WeatherSearchWidget {
    container;
    weatherService;
    storageService;
    buttonHandler = null;
    searchHandler = null;
    constructor(container, weatherService, storageService) {
        this.container = container;
        this.weatherService = weatherService;
        this.storageService = storageService;
        this.render();
        this.bindEvents();
    }
    render() {
        this.container.innerHTML = `
      <form id="searchForm">
        <input type="text" id="cityInput" placeholder="Enter your city">
        <button type="submit" id="getWeatherBtn">Get Weather</button>
        <div id="weatherResult"></div>
      </form>
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
        EventBus_1.eventBus.on('city:selected', this.searchHandler);
    }
    async handleSearch() {
        if (!this.container)
            return;
        const input = this.container.querySelector('#cityInput');
        if (!input)
            return;
        const city = input.value.trim();
        if (!city)
            return;
        //await this.searchWeather(city);
        EventBus_1.eventBus.emit('city:search', city);
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
          <p>${weather.weather[0]?.description || 'Нет описания'}</p>
        </div>
      `;
            EventBus_1.eventBus.emit('weather:search:success', { city, weather });
        }
        catch (error) {
            resultDiv.textContent = '';
            const errorMessage = error instanceof Error ? error.message : String(error);
            EventBus_1.eventBus.emit('error', errorMessage);
        }
        finally {
            const input = this.container.querySelector('#cityInput');
            if (input) {
                input.value = '';
            }
        }
    }
    unsubscribe() {
        if (this.searchHandler) {
            EventBus_1.eventBus.off('city:selected', this.searchHandler);
            this.searchHandler = null;
        }
        const button = this.container.querySelector('#getWeatherBtn');
        if (button && this.buttonHandler) {
            button.removeEventListener('click', this.buttonHandler);
        }
        this.buttonHandler = null;
    }
}
exports.WeatherSearchWidget = WeatherSearchWidget;
//# sourceMappingURL=WeatherSearchWidget.js.map