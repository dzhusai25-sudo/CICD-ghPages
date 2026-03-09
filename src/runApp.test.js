import { runApp } from './runApp';
import { WeatherService } from '../src/services/WeatherService';
import { LocationService } from '../src/services/LocationService';
import { StorageService } from '../src/services/StorageService';
import { WeatherCurrentWidget } from '../src/widgets/WeatherCurrentWidget.js';
import { WeatherSearchWidget } from '../src/widgets/WeatherSearchWidget.js';
import { SearchHistoryWidget } from '../src/widgets/SearchHistoryWidget.js';
import { ErrorWidget } from '../src/widgets/ErrorWidget.js';
import { EventBus } from './EventBus.js';

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
    expect(el.querySelector('#getWeatherBtn')).not.toBeNull();
    expect(el.querySelector('#searchWidget')).not.toBeNull();
    expect(el.querySelector('#historyWidget')).not.toBeNull();
    expect(el.querySelector('#currentWidget')).not.toBeNull();
    expect(el.querySelector('#errorWidget')).not.toBeNull();

    // лоадинг после клика
    el.querySelector('#cityInput').value = 'Tomsk';
    el.querySelector('#getWeatherBtn').click();
    expect(el.querySelector('#weatherResult').textContent).toContain(
      'Загрузка...',
    );
  });

  it('должна отображать состояние загрузки при запросе погоды', async () => {
    await runApp(appContainer);

    const input = appContainer.querySelector('#cityInput');
    const button = appContainer.querySelector('#getWeatherBtn');
    const resultDiv = appContainer.querySelector('#weatherResult');

    input.value = 'Tomsk';
    button.click();

    expect(resultDiv.textContent).toContain('Загрузка...');
  });

  it('должна корректно отображать историю поиска', async () => {
    const storageService = new StorageService();
    storageService.addCityToHistory('Moscow');

    await runApp(appContainer);

    const historyDiv = appContainer.querySelector('#historyWidget');
    const listItems = historyDiv.querySelectorAll('li');

    expect(listItems.length).toBeGreaterThanOrEqual(1);
    expect(listItems[0].textContent).toBe('Moscow');
  });
});

describe('EventBus', () => {
  let bus;

  beforeEach(() => {
    bus = new EventBus();
  });

  test('подписка и отправка событий', () => {
    const callback = jest.fn();
    bus.on('testEvent', callback);
    bus.emit('testEvent', 'arg1', 'arg2');
    expect(callback).toHaveBeenCalledWith('arg1', 'arg2');
  });

  test('отписка от событий', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    bus.on('testEvent', callback1);
    bus.on('testEvent', callback2);
    bus.off('testEvent', callback1);

    bus.emit('testEvent');
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });

  test('эмит события без подписчиков', () => {
    expect(() => bus.emit('unknown')).not.toThrow();
  });

  test('несколько событий с разными обработчиками', () => {
    const cb1 = jest.fn();
    const cb2 = jest.fn();

    bus.on('event1', cb1);
    bus.on('event2', cb2);

    bus.emit('event1');
    bus.emit('event2');

    expect(cb1).toHaveBeenCalled();
    expect(cb2).toHaveBeenCalled();
  });

  test('удаление всех обработчиков при пустом наборе', () => {
    const callback = jest.fn();
    bus.on('test', callback);
    bus.off('test', callback);
    expect(bus.events.has('test')).toBe(false);
  });
});

describe('WeatherSearchWidget', () => {
  let container;
  let widget;
  const mockWeatherService = {
    fetchWeather: jest.fn(),
  };
  const mockStorageService = {
    addCityToHistory: jest.fn(),
  };

  beforeEach(() => {
    container = document.createElement('div');
    widget = new WeatherSearchWidget(
      container,
      mockWeatherService,
      mockStorageService,
    );
  });

  test('рендеринг интерфейса', () => {
    expect(container.querySelector('#cityInput')).not.toBeNull();
    expect(container.querySelector('#getWeatherBtn')).not.toBeNull();
  });

  test('поиск города вызывает fetchWeather', async () => {
    mockWeatherService.fetchWeather.mockResolvedValue({ name: 'Moscow' });
    const input = container.querySelector('#cityInput');
    input.value = 'Moscow';
    const button = container.querySelector('#getWeatherBtn');
    button.click();

    await Promise.resolve();

    expect(mockWeatherService.fetchWeather).toHaveBeenCalledWith('Moscow');
  });

  test('обновление истории при успешном поиске', async () => {
    mockWeatherService.fetchWeather.mockResolvedValue({});
    const input = container.querySelector('#cityInput');
    input.value = 'Moscow';
    const button = container.querySelector('#getWeatherBtn');
    button.click();

    await Promise.resolve();

    expect(mockStorageService.addCityToHistory).toHaveBeenCalledWith('Moscow');
  });
});

describe('WeatherCurrentWidget', () => {
  let container;
  let widget;

  const mockWeatherService = {
    fetchWeather: jest.fn(),
  };
  const mockLocationService = {
    getCurrentLocation: jest.fn(),
  };

  beforeEach(() => {
    container = document.createElement('div');
    widget = new WeatherCurrentWidget(
      container,
      mockWeatherService,
      mockLocationService,
    );
  });

  test('рендеринг интерфейса с лоадером', () => {
    widget.render();
    expect(container.querySelector('.current-weather')).not.toBeNull();
    expect(container.querySelector('.current-weather').textContent).toBe(
      'Загрузка текущей погоды...',
    );
  });
});
