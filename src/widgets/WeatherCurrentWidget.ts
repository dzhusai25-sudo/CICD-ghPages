import { eventBus } from '../EventBus';
import { WeatherService } from '../services/WeatherService';
import { LocationService } from '../services/LocationService';
import { WeatherData } from '../interfaces/Interfaces';

export class WeatherCurrentWidget {
  private container: Element;
  private weatherService: WeatherService;
  private locationService: LocationService;

  constructor(container: Element, weatherService: WeatherService, locationService: LocationService) {
    this.container = container;
    this.weatherService = weatherService;
    this.locationService = locationService;
  }

  async render(weatherData: WeatherData): Promise<void> {
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      eventBus.emit('error', errorMessage);
    }
  }
}