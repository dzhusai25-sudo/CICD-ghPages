export class EventBus {
  constructor() {
    this.events = new Map();
  }

  on(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }
    this.events.get(eventName).add(callback);
  }

  off(eventName, callback) {
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.events.delete(eventName);
      }
    }
  }

  emit(eventName, ...args) {
    const callbacks = this.events.get(eventName) || new Set();
    for (const callback of callbacks) {
      callback(...args);
    }
  }
}

export const eventBus = new EventBus();
