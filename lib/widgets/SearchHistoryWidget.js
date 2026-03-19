"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchHistoryWidget = void 0;
const EventBus_1 = require("../EventBus");
class SearchHistoryWidget {
    container;
    storageService;
    constructor(container, storageService) {
        this.container = container;
        this.storageService = storageService;
        this.render();
        EventBus_1.eventBus.on('weather:search:success', () => this.render());
    }
    render() {
        const history = this.storageService.getHistory();
        this.container.innerHTML = `
      <div class="search-history">
        <h4>История поиска</h4>
        ${history.length ?
            `<ul>${history.map((city) => `<li><a href="/weather/${city}" data-route="/weather/${city}">${city.toUpperCase()}</a></li>`).join('')}</ul>`
            :
                '<p>История пуста</p>'}
      </div>
    `;
    }
}
exports.SearchHistoryWidget = SearchHistoryWidget;
//# sourceMappingURL=SearchHistoryWidget.js.map