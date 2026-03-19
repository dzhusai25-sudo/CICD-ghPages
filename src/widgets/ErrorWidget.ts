import { eventBus } from '../EventBus';

export class ErrorWidget {
  private container: Element | null;

  constructor(container: Element) {
    this.container = container;
    this.bindEvents();
  }

  bindEvents() {
    eventBus.on('error', (message: string) => {
      (this.container as Element).innerHTML = `<div class="error">${message}</div>`;
      setTimeout(() => {
        (this.container as Element).innerHTML = '';
      }, 2000);
    });
  }
}
