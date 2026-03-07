import { runApp } from './runApp';
import { WeatherService } from '../src/services/WeatherService';
import { LocationService } from '../src/services/LocationService';
import { StorageService } from '../src/services/StorageService';

global.fetch = jest.fn();

describe('WeatherService', () => {
  let weatherService;

  beforeEach(() => {
    weatherService = new WeatherService('test-api-key');
    fetch.mockClear();
  });

  test('получение данных о погоде', async () => {
    const mockData = {
      name: 'Moscow',
      main: { temp: 20, feels_like: 18, humidity: 60, pressure: 1013 },
      sys: { country: 'RU' },
      weather: [{ description: 'clear sky' }],
    };

    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const result = await weatherService.fetchWeather('Moscow');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockData);
  });

  test('ошибка при неверном городе', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValue({}),
    });

    await expect(weatherService.fetchWeather('UnknownCity')).rejects.toThrow(
      'Город не найден',
    );
  });
});

describe('LocationService', () => {
  let locationService;

  beforeEach(() => {
    locationService = new LocationService();
    fetch.mockClear();
  });

  test('должен успешно получить город из геолокации', async () => {
    const mockData = { city: 'Moscow' };

    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const city = await locationService.getCurrentLocation();

    expect(city).toBe('Moscow');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('должен выбросить ошибку, если нет данных о городе', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ ip: '127.0.0.1' }),
    });

    await expect(locationService.getCurrentLocation()).rejects.toThrow(
      'Не удалось получить название города',
    );
  });

  test('должен выбросить ошибку при проблемах с геолокацией', async () => {
    fetch.mockResolvedValue({ ok: false });

    await expect(locationService.getCurrentLocation()).rejects.toThrow(
      'Не удалось определить текущее местоположение',
    );
  });
});

describe('StorageService', () => {
  let storageService;

  beforeEach(() => {
    storageService = new StorageService('TestCities');
    localStorage.clear();
  });

  test('пустая история, если данных нет', () => {
    expect(storageService.getHistory()).toEqual([]);
  });

  test('в историю запросов добавляется до 10 городов', () => {
    // Заполняем историю 10 городами
    const initialHistory = Array.from({ length: 10 }, (_, i) => `City${i + 1}`);
    storageService.saveHistory(initialHistory);

    // Добавляем новый город
    const newHistory = storageService.addCityToHistory('NewCity');

    expect(newHistory.length).toBe(10);
    expect(newHistory[0]).toBe('NewCity');
    expect(newHistory).not.toContain('City10'); // Старый город должен быть удалён
  });

  test('должен удалять дубликаты из истории', () => {
    storageService.addCityToHistory('Moscow');
    storageService.addCityToHistory('London');
    storageService.addCityToHistory('Moscow'); // Дубликат

    const history = storageService.getHistory();
    expect(history).toEqual(['Moscow', 'London']);
  });
});

describe('Check runApp', () => {
  let appContainer;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    appContainer = document.createElement('div');
    document.body.appendChild(appContainer);
  });

  afterEach(() => {
    console.error.mockRestore();
    document.body.removeChild(appContainer);
    localStorage.clear();
  });

  it('function test', () => expect(runApp).toBeInstanceOf(Function));

  it('div test', () => {
    const el = document.createElement('div');
    runApp(el);
    expect(el.innerHTML.length).toBeGreaterThanOrEqual(0);
  });

  it('инициализация интерфейса приложения', async () => {
    const el = document.createElement('div');
    await runApp(el);

    // основные элементы интерфейса
    expect(el.querySelector('#cityInput')).not.toBeNull();
    expect(el.querySelector('#getWeatherButton')).not.toBeNull();
    expect(el.querySelector('#weatherResult')).not.toBeNull();
    expect(el.querySelector('#searchHistory')).not.toBeNull();
    expect(el.querySelector('#currentWeather')).not.toBeNull();

    // лоадинг после клика
    el.querySelector('#cityInput').value = 'Tomsk';
    el.querySelector('#getWeatherButton').click();
    expect(el.querySelector('#weatherResult').textContent).toContain(
      'Загрузка...',
    );
    expect(el.querySelector('#getWeatherButton').disabled).toBe(true);
  });

  it('должна отображать состояние загрузки при запросе погоды', async () => {
    await runApp(appContainer);

    const input = appContainer.querySelector('#cityInput');
    const button = appContainer.querySelector('#getWeatherButton');
    const resultDiv = appContainer.querySelector('#weatherResult');

    input.value = 'Tomsk';

    // Имитируем клик
    button.click();

    // Проверяем состояние загрузки
    expect(resultDiv.textContent).toContain('Загрузка...');
    expect(button.disabled).toBe(true);
  });

  it('должна сбрасывать состояние загрузки после завершения запроса', async () => {
    await runApp(appContainer);

    const input = appContainer.querySelector('#cityInput');
    const button = appContainer.querySelector('#getWeatherButton');
    const resultDiv = appContainer.querySelector('#weatherResult');

    input.value = 'Moscow';

    // Имитируем клик
    button.click();

    // Ждём завершения асинхронной операции
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Проверяем, что кнопка разблокирована
    expect(button.disabled).toBe(false);

    // Проверяем, что загрузка завершена (не содержит «Загрузка...»)
    expect(resultDiv.textContent).not.toContain('Загрузка...');
  });

  it('должна корректно отображать историю поиска', async () => {
    // Предварительно добавляем город в историю
    const storageService = new StorageService();
    storageService.addCityToHistory('Moscow');

    await runApp(appContainer);

    const historyDiv = appContainer.querySelector('#searchHistory');
    const listItems = historyDiv.querySelectorAll('li');

    expect(listItems.length).toBeGreaterThanOrEqual(1);
    expect(listItems[0].textContent).toBe('Moscow');
  });
});
