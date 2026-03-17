import { eventBus } from '../EventBus.js';

export class WeatherCurrentWidget {
  constructor(container, weatherService, locationService) {
    this.container = container;
    this.weatherService = weatherService;
    this.locationService = locationService;
  }

  async render(weatherData) {
    try {
      if (!weatherData) {
        this.container.innerHTML = `
      <div class="weather-current">
        <h3>Погода в вашем городе</h3>
        <div class="current-weather">Загрузка текущей погоды...</div>
      </div>
    `;
        return;
      }

      this.container.innerHTML = `
        <div class="weather-current">
          <h3>Погода в вашем городе</h3>
          <div class="current-weather">${weatherData.name}: ${weatherData.main.temp}°C</div>
        </div>
      `;
      eventBus.emit('weather:current:loaded', { weatherData });
    } catch (error) {
      eventBus.emit('error', error.message);
    }
  }
}