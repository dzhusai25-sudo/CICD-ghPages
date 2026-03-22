import { eventBus } from '../EventBus';
import { StorageService } from '../services/StorageService';

export class SearchHistoryWidget {
  private container: HTMLElement;
  private storageService: StorageService;

  constructor(container: HTMLElement, storageService: StorageService) {
    this.container = container;
    this.storageService = storageService;
    this.render();

    eventBus.on('weather:search:success', () => this.render());
  }

  render() {
    const history = this.storageService.getHistory();
    this.container.innerHTML = `
      <div class="search-history">
        <h4>История поиска</h4>
        ${
          history.length ? 
          `<ul>${history.map((city: string) => `<li><a href="/weather/${city}" data-route="/weather/${city}">${city.toUpperCase()}</a></li>`).join('')}</ul>`
            : 
            '<p>История пуста</p>'
        }
      </div>
    `;
  }
}