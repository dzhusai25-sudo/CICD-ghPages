export class WeatherService {
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
