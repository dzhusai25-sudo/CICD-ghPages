import { eventBus } from '../EventBus';
import { WeatherService } from '../services/WeatherService';
import { StorageService } from '../services/StorageService';
import { WeatherData } from '../interfaces/Interfaces';

type CitySelectedCallback = (city: string) => void;

export class WeatherSearchWidget {
    private container: HTMLElement;
    private weatherService: WeatherService;
    private storageService: StorageService;
    private buttonHandler: ((event: Event) => void) | null = null;
    private searchHandler: CitySelectedCallback | null = null;

  constructor(container: HTMLElement, weatherService: WeatherService, storageService: StorageService) {
    this.container = container;
    this.weatherService = weatherService;
    this.storageService = storageService;
    this.render();
    this.bindEvents();
  }

  render(): void {
    this.container.innerHTML = `
      <form id="searchForm">
        <input type="text" id="cityInput" placeholder="Enter your city">
        <button type="submit" id="getWeatherBtn">Get Weather</button>
        <div id="weatherResult"></div>
      </form>
    `;
  }

  bindEvents(): void  {
    this.unsubscribe();
    this.buttonHandler = this.handleSearch.bind(this);
    const button = this.container.querySelector('#getWeatherBtn');
    if (button) {
      button.addEventListener('click', this.buttonHandler);
    }
    this.searchHandler = (city) => this.searchWeather(city);
    eventBus.on('city:selected', this.searchHandler);
  }

  async handleSearch(): Promise<void> {
    if (!this.container) return;

    const input = this.container.querySelector<HTMLInputElement>('#cityInput');
    if (!input) return;
    const city = input.value.trim();
    if (!city) return;

    //await this.searchWeather(city);
    eventBus.emit('city:search', city);
  }

  async searchWeather(city: string): Promise<void> {
    const resultDiv = this.container.querySelector('#weatherResult');
    (resultDiv as HTMLElement).textContent = 'Загрузка...';

    try {
      const weather = await this.weatherService.fetchWeather(city);
      this.storageService.addCityToHistory(city);

      (resultDiv as HTMLElement).innerHTML = `
        <div class="weather-card">
          <h4>${weather.name}</h4>
          <p>Температура: ${weather.main.temp}°C</p>
          <p>${weather.weather[0]?.description || 'Нет описания'}</p>
        </div>
      `;

      eventBus.emit('weather:search:success', { city, weather });
    } catch (error) {
      (resultDiv as HTMLElement).textContent = '';
      const errorMessage = error instanceof Error ? error.message : String(error);
      eventBus.emit('error', errorMessage);
    } finally {
      const input = this.container.querySelector<HTMLInputElement>('#cityInput');
      if (input) {
        input.value = '';
      }
    }
  }

  unsubscribe(): void  {
    if (this.searchHandler) {
      eventBus.off('city:selected', this.searchHandler);
      this.searchHandler = null;
    }

    const button = this.container.querySelector('#getWeatherBtn');
    if (button && this.buttonHandler) {
      button.removeEventListener('click', this.buttonHandler);
    }
    this.buttonHandler = null;
  }
}
