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
  it('function test', () => expect(runApp).toBeInstanceOf(Function));

  it('div test', () => {
    const el = document.createElement('div');
    runApp(el);
    expect(el.innerHTML.length).toBeGreaterThanOrEqual(0);
  });
});
