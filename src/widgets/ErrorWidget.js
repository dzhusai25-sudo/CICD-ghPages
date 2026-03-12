import { eventBus } from '../EventBus.js';

export class ErrorWidget {
  constructor(container) {
    this.container = container;
    this.bindEvents();
  }

  bindEvents() {
    eventBus.on('error', (message) => {
      this.container.innerHTML = `<div class="error">${message}</div>`;
      setTimeout(() => {
        this.container.innerHTML = '';
      }, 2000);
    });
  }
}
