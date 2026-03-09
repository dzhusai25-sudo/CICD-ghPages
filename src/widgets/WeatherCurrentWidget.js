import { eventBus } from '../EventBus.js';

export class WeatherCurrentWidget {
  constructor(container, weatherService, locationService) {
    this.container = container;
    this.weatherService = weatherService;
    this.locationService = locationService;
  }

  async render() {
    this.container.innerHTML = `
      <div class="weather-current">
        <h3>Текущая погода</h3>
        <div class="current-weather">Загрузка текущей погоды...</div>
      </div>
    `;

    try {
      const city = await this.locationService.getCurrentLocation();
      const weather = await this.weatherService.fetchWeather(city);

      this.container.querySelector('.current-weather').innerHTML = `
        ${weather.name}: ${weather.main.temp}°C
      `;

      eventBus.emit('weather:current:loaded', { city, weather });
    } catch (error) {
      eventBus.emit('error', error.message);
    }
  }
}
