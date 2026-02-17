import './runApp.css';

export function runApp(el) {
  el.innerHTML = `
    <div class="weather-app">
      <h1 class="runApp">Enjoy your weather!</h1>
      <h1 class="runApp">... (or not)</h1>
      <input
        id="cityInput"
        placeholder="Enter your city"
        aria-label="City name"
      />
      <button id="getWeatherButton" type="button">Get Weather</button>
      <div id="weatherResult" class="weather-result"></div>
    </div>
  `;

  const input = el.querySelector('#cityInput');
  const button = el.querySelector('#getWeatherButton');
  const resultDiv = el.querySelector('#weatherResult');

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
      const API_ID = '97d93f1704dcb8e35dd2045c8e75710d';
      const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${API_ID}&lang=ru`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Город не найден или ошибка API');
      }

      const data = await response.json();

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
