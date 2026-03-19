import { WeatherService } from '../services/WeatherService';
import { LocationService } from '../services/LocationService';
import { WeatherData } from '../interfaces/Interfaces';
export declare class WeatherCurrentWidget {
    private container;
    private weatherService;
    private locationService;
    constructor(container: Element, weatherService: WeatherService, locationService: LocationService);
    render(weatherData: WeatherData): Promise<void>;
}
//# sourceMappingURL=WeatherCurrentWidget.d.ts.map