import { eventBus } from '../EventBus.js';

export class ErrorWidget {
  constructor(container) {
    this.container = container;
    this.bindEvents();
  }

  bindEvents() {
    eventBus.on('error', (message) => {
      this.container.innerHTML = `<div class="error">${message}</div>`;
      // Автоматически скрываем ошибку через 5 секунд
      setTimeout(() => {
        this.container.innerHTML = '';
      }, 5000);
    });
  }
}
