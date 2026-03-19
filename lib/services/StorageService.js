"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
class StorageService {
    key;
    constructor(key = 'Cities') {
        this.key = key;
    }
    getHistory() {
        return JSON.parse(localStorage.getItem(this.key)) || [];
    }
    saveHistory(history) {
        localStorage.setItem(this.key, JSON.stringify(history));
    }
    addCityToHistory(city) {
        let history = this.getHistory();
        history = history.filter((el) => el.toLowerCase() !== city.toLowerCase());
        history.unshift(city);
        history = history.slice(0, 10);
        this.saveHistory(history);
        return history;
    }
}
exports.StorageService = StorageService;
//# sourceMappingURL=StorageService.js.map