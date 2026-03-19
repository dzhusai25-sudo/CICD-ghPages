"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
class WeatherService {
    apiId;
    baseUrl;
    constructor(apiId) {
        this.apiId = apiId;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    }
    async fetchWeather(city) {
        const url = `${this.baseUrl}?units=metric&q=${city}&appid=${this.apiId}&lang=ru`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Город не найден или ошибка API');
        }
        return await response.json();
    }
}
exports.WeatherService = WeatherService;
//# sourceMappingURL=WeatherService.js.map