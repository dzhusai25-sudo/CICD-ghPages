"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherCurrentWidget = void 0;
const EventBus_1 = require("../EventBus");
class WeatherCurrentWidget {
    container;
    weatherService;
    locationService;
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
            EventBus_1.eventBus.emit('weather:current:loaded', { weatherData });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            EventBus_1.eventBus.emit('error', errorMessage);
        }
    }
}
exports.WeatherCurrentWidget = WeatherCurrentWidget;
//# sourceMappingURL=WeatherCurrentWidget.js.map