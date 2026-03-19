"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
class LocationService {
    geoUrl;
    constructor() {
        this.geoUrl = 'https://get.geojs.io/v1/ip/geo.json';
    }
    async getCurrentLocation() {
        const response = await fetch(this.geoUrl);
        if (!response.ok) {
            throw new Error('Не удалось определить текущее местоположение');
        }
        const data = await response.json();
        if (!data.city) {
            throw new Error('Не удалось получить название города');
        }
        return data.city;
    }
}
exports.LocationService = LocationService;
//# sourceMappingURL=LocationService.js.map