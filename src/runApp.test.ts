//мокк для глобальной переменной и url
declare global {
  var PRODUCTION: boolean;
  var PREFIX: string;
}

global.PRODUCTION = false;
global.PREFIX = '/';

import { runApp } from './runApp';
import { WeatherService } from './services/WeatherService';
import { LocationService } from './services/LocationService';
import { StorageService } from './services/StorageService';
import { WeatherCurrentWidget } from './widgets/WeatherCurrentWidget';
import { WeatherSearchWidget } from './widgets/WeatherSearchWidget';
import { SearchHistoryWidget } from './widgets/SearchHistoryWidget';
import { ErrorWidget } from './widgets/ErrorWidget';
import { eventBus } from './EventBus';
import { Router } from './Router';
import { EventMap as OriginalEventMap } from './interfaces/Interfaces';

declare module './interfaces/Interfaces' {
  interface EventMap {
    'testEvent': [string, string];
    'unknown': [];
    'event1': [];
    'event2': [];
    'test': [];
  }
}


let weatherService: WeatherService;
let locationService: LocationService;
let storageService: StorageService;
let appContainer: HTMLDivElement;
let container: HTMLDivElement;
let widget: WeatherSearchWidget;
let router: Router;
let mockHandler: jest.Mock;


global.fetch = jest.fn();
const mockedFetch = fetch as jest.Mock;

describe('WeatherService', () => {

  beforeEach(() => {
    weatherService = new WeatherService('test-api-key');
    mockedFetch.mockClear();
  });

  test('получение данных о погоде', async () => {
    const mockData = {
      name: 'Moscow',
      main: { temp: 20, feels_like: 18, humidity: 60, pressure: 1013 },
      sys: { country: 'RU' },
      weather: [{ description: 'clear sky' }],
    };

    mockedFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const result = await weatherService.fetchWeather('Moscow');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockData);
  });

  test('ошибка при неверном городе', async () => {
    mockedFetch.mockResolvedValue({
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

  beforeEach(() => {
    locationService = new LocationService();
    mockedFetch.mockClear();
  });

  test('должен успешно получить город из геолокации', async () => {
    const mockData = { city: 'Moscow' };

    mockedFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const city = await locationService.getCurrentLocation();

    expect(city).toBe('Moscow');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('должен выбросить ошибку, если нет данных о городе', async () => {
    mockedFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ ip: '127.0.0.1' }),
    });

    await expect(locationService.getCurrentLocation()).rejects.toThrow(
      'Не удалось получить название города',
    );
  });

  test('должен выбросить ошибку при проблемах с геолокацией', async () => {
    mockedFetch.mockResolvedValue({ ok: false });

    await expect(locationService.getCurrentLocation()).rejects.toThrow(
      'Не удалось определить текущее местоположение',
    );
  });
});

describe('StorageService', () => {

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
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    appContainer = document.createElement('div');
    document.body.appendChild(appContainer);
    
    // Мок для fetch (LocationService)
    mockedFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ city: 'Moscow' }),
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
    document.body.removeChild(appContainer);
    localStorage.clear();
    jest.clearAllMocks();
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
    expect(el.querySelector('#searchWidget')).not.toBeNull();
    expect(el.querySelector('#historyWidget')).not.toBeNull();
    expect(el.querySelector('#currentWidget')).not.toBeNull();
    expect(el.querySelector('#errorWidget')).not.toBeNull();

    // нави
    expect(el.querySelector('.navi')).not.toBeNull();
    expect(el.querySelectorAll('[data-route]').length).toBe(5); // 5 ссылок в навигации
    
    // заголовки
    expect(el.querySelector('.runApp')).not.toBeNull();
    expect(el.querySelector('.orNot')).not.toBeNull();
  });

  it('должна корректно отображать историю поиска', async () => {
    const storageService = new StorageService();
    storageService.addCityToHistory('Moscow');

    await runApp(appContainer);

    //время на рендеринг
    await new Promise(resolve => setTimeout(resolve, 50));

    const historyDiv = appContainer.querySelector('#historyWidget');
    const listItems = historyDiv!.querySelectorAll('li');

    expect(listItems.length).toBeGreaterThanOrEqual(1);
    expect(listItems[0]!.textContent).toBe('MOSCOW');
  });
});

describe('EventBus', () => {

  test('подписка и отправка событий', () => {
    const callback = jest.fn();
    eventBus.on('testEvent', callback);
    eventBus.emit('testEvent', 'arg1', 'arg2');
    expect(callback).toHaveBeenCalledWith('arg1', 'arg2');
  });

  test('отписка от событий', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    eventBus.on('testEvent', callback1);
    eventBus.on('testEvent', callback2);
    eventBus.off('testEvent', callback1);

    eventBus.emit('testEvent', '', '');
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });

  test('эмит события без подписчиков', () => {
    expect(() => eventBus.emit('unknown')).not.toThrow();
  });

  test('несколько событий с разными обработчиками', () => {
    const cb1 = jest.fn();
    const cb2 = jest.fn();

    eventBus.on('event1', cb1);
    eventBus.on('event2', cb2);

    eventBus.emit('event1');
    eventBus.emit('event2');

    expect(cb1).toHaveBeenCalled();
    expect(cb2).toHaveBeenCalled();
  });

  test('удаление всех обработчиков при пустом наборе', () => {
    const callback = jest.fn();
    eventBus.on('test', callback);
    eventBus.off('test', callback);
    eventBus.emit('test');
    expect(callback).not.toHaveBeenCalled();
  });
});

describe('WeatherSearchWidget', () => {
  let container: HTMLElement;
  let widget: WeatherSearchWidget;
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
      mockWeatherService as any,
      mockStorageService as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('рендеринг интерфейса', () => {
    expect(container.querySelector('#cityInput')).not.toBeNull();
    expect(container.querySelector('#getWeatherBtn')).not.toBeNull();
  });

  test('поиск города вызывает fetchWeather', async () => {
    const emitSpy = jest.spyOn(eventBus, 'emit');
    const input = container.querySelector<HTMLInputElement>('#cityInput')!;
    input.value = 'Moscow';
  
    (widget as any).handleSearch();

    expect(emitSpy).toHaveBeenCalledWith('city:search', 'Moscow');
    emitSpy.mockRestore();
  });
});

describe('WeatherCurrentWidget', () => {
  let container: HTMLElement;
  let widget: WeatherCurrentWidget;

  const mockWeatherService = {
    fetchWeather: jest.fn(),
    apiId: 'test',
    baseUrl: 'http://test.com',
  };
  const mockLocationService = {
    getCurrentLocation: jest.fn(),
  };

  beforeEach(() => {
    container = document.createElement('div');
    widget = new WeatherCurrentWidget(
      container,
      mockWeatherService as any,
      mockLocationService as any,
    );
  });

  test('рендеринг интерфейса с лоадером', () => {
    widget.render(null!);
    expect(container.querySelector('.current-weather')).not.toBeNull();
    expect(container.querySelector('.current-weather')!.textContent).toBe(
      'Загрузка текущей погоды...',
    );
  });


describe('Router', () => {
  let router: Router;
  let mockHandler: jest.Mock;
  let originalAddEventListener: typeof window.addEventListener;
  let originalDocumentAddEventListener: typeof document.addEventListener;

  beforeEach(() => {
    originalAddEventListener = window.addEventListener;
    originalDocumentAddEventListener = document.addEventListener;

    // Мокаем addEventListener
    window.addEventListener = jest.fn();
    document.addEventListener = jest.fn();

    mockHandler = jest.fn().mockResolvedValue(undefined);
    router = new Router();
  });

  afterEach(() => {
    window.addEventListener = originalAddEventListener;
    document.addEventListener = originalDocumentAddEventListener;
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('должен создавать экземпляр с пустыми маршрутами', () => {
      expect(router.routes).toEqual([]);
      expect(router.currentRoute).toBeNull();
    });

    test('должен создавать экземпляр с basePath', () => {
      const routerWithBase = new Router('/base');
      expect(routerWithBase.basePath).toBe('/base');
    });
  });

  describe('addRoute', () => {
    test('должен добавлять статический маршрут', () => {
      router.addRoute('/about', mockHandler);

      const route = router.routes.find(r => r.path === '/about');
      expect(route).toBeDefined();
      expect(route!.type).toBe('static');
      expect(route!.handler).toBe(mockHandler);
    });

    test('должен добавлять параметрический маршрут', () => {
      router.addRoute('/weather/*', mockHandler);

      const route = router.routes.find(r => r.path === '/weather');
      expect(route).toBeDefined();
      expect(route!.type).toBe('param');
      expect(route!.handler).toBe(mockHandler);
    });

    test('должен добавлять маршрут для 404', () => {
      router.addRoute('*', mockHandler);

      const route = router.routes.find(r => r.path === '*');
      expect(route).toBeDefined();
      expect(route!.type).toBe('static');
      expect(route!.handler).toBe(mockHandler);
    });
  });

  describe('findMatchingRoute', () => {
    beforeEach(() => {
      router.addRoute('/', mockHandler);
      router.addRoute('/about', mockHandler);
      router.addRoute('/weather/*', mockHandler);
      router.addRoute('*', mockHandler);
    });

    test('должен находить статический маршрут', () => {
      const result = router.findMatchingRoute('/about');
      expect(result).not.toBeNull();
      expect(result!.handler).toBe(mockHandler);
    });

    test('должен находить параметрический маршрут', () => {
      const result = router.findMatchingRoute('/weather/Moscow');
      expect(result).not.toBeNull();
      expect(result!.params).toEqual(['Moscow']);
    });
  });

  describe('handleRoute', () => {
    beforeEach(() => {
      router.addRoute('/', mockHandler);
      router.addRoute('/about', mockHandler);
    });

    test('должен вызывать обработчик для маршрута', async () => {
      await router.handleRoute('/about');
      expect(mockHandler).toHaveBeenCalled();
    });

    test('должен обновлять currentRoute', async () => {
      await router.handleRoute('/about');
      expect(router.currentRoute).toBe('/about');
    });
  });

  describe('navigate', () => {
    test('должен вызывать handleRoute с правильным путем', async () => {
      const handleRouteSpy = jest.spyOn(router, 'handleRoute');
      await router.navigate('/about');
      expect(handleRouteSpy).toHaveBeenCalledWith('/about');
    });
  });

  describe('init', () => {
    test('должен добавлять обработчики событий', () => {
      router.init();
      expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith('popstate', expect.any(Function));
    });

    test('должен обрабатывать начальный маршрут', () => {
      // Мокаем метод, чтобы избежать обращения к window.location
      jest.spyOn(router, 'getCurrentPathWithoutBase').mockReturnValue('/');
      const handleRouteSpy = jest.spyOn(router, 'handleRoute');
      router.init();
      expect(handleRouteSpy).toHaveBeenCalled();
    });
  });
});
});