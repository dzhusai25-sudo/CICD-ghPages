import { eventBus } from '../EventBus.js';

export class SearchHistoryWidget {
  constructor(container, storageService) {
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
          history.length
            ? `<ul>${history.map((city) => `<li>${city.toUpperCase()}</li>`).join('')}</ul>`
            : '<p>История пуста</p>'
        }
      </div>
    `;
  }
}
