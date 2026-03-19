export class StorageService {
  key: string;

  constructor(key = 'Cities') {
    this.key = key;
  }

  getHistory(): string[] {
    return JSON.parse(localStorage.getItem(this.key) as string) || [];
  }

  saveHistory(history: object) {
    localStorage.setItem(this.key, JSON.stringify(history));
  }

  addCityToHistory(city: string): string[] {
    let history = this.getHistory();
    history = history.filter((el) => el.toLowerCase() !== city.toLowerCase());
    history.unshift(city);
    history = history.slice(0, 10);
    this.saveHistory(history);
    return history;
  }
}
