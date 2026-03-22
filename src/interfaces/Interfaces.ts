export type RouteType = 'static' | 'param';

export interface Route {
  type: RouteType;
  path: string;
  handler: RouteHandler;
}

export type RouteHandler = (params: string[]) => Promise<void> | void;

export interface MatchedRoute {
  handler: RouteHandler;
  params: string[];
}

export interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: Array<{
    description: string;
  }>;
}

export interface EventMap {
  'city:search': [city: string];
  'city:selected': [city: string];
  'weather:search:success': [data: { city: string; weather: WeatherData }];
  'weather:current:loaded': [data: { weatherData: WeatherData }];
  'error': [message: string];
}