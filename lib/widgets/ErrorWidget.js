"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorWidget = void 0;
const EventBus_1 = require("../EventBus");
class ErrorWidget {
    container;
    constructor(container) {
        this.container = container;
        this.bindEvents();
    }
    bindEvents() {
        EventBus_1.eventBus.on('error', (message) => {
            this.container.innerHTML = `<div class="error">${message}</div>`;
            setTimeout(() => {
                this.container.innerHTML = '';
            }, 2000);
        });
    }
}
exports.ErrorWidget = ErrorWidget;
//# sourceMappingURL=ErrorWidget.js.map