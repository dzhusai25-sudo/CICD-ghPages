import { WeatherService } from '../services/WeatherService';
import { StorageService } from '../services/StorageService';
export declare class WeatherSearchWidget {
    private container;
    private weatherService;
    private storageService;
    private buttonHandler;
    private searchHandler;
    constructor(container: HTMLElement, weatherService: WeatherService, storageService: StorageService);
    render(): void;
    bindEvents(): void;
    handleSearch(): Promise<void>;
    searchWeather(city: string): Promise<void>;
    unsubscribe(): void;
}
//# sourceMappingURL=WeatherSearchWidget.d.ts.map