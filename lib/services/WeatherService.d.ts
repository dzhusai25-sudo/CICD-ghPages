import { WeatherData } from '../interfaces/Interfaces';
export declare class WeatherService {
    private apiId;
    private baseUrl;
    constructor(apiId: string);
    fetchWeather(city: string): Promise<WeatherData>;
}
//# sourceMappingURL=WeatherService.d.ts.map