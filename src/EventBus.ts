import { EventMap } from "./interfaces/Interfaces";

type EventCallback<T extends keyof EventMap> = (...args: EventMap[T]) => void;

export class EventBus {
  private events = new Map<keyof EventMap, Set<EventCallback<keyof EventMap>>>();

  constructor() {
    this.events = new Map();
  }

  on<T extends keyof EventMap>(eventName: T, callback: EventCallback<T>): void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }
    this.events.get(eventName)!.add(callback as EventCallback<keyof EventMap>);
  }

  off<T extends keyof EventMap>(eventName: T, callback: EventCallback<T>): void {
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      callbacks.delete(callback as EventCallback<keyof EventMap>);
      if (callbacks.size === 0) {
        this.events.delete(eventName);
      }
    }
  }

  emit<T extends keyof EventMap>(eventName: T, ...args: EventMap[T]): void {
    const callbacks = this.events.get(eventName) || new Set();
    for (const callback of callbacks) {
      (callback as EventCallback<T>)(...args);
    }
  }
}

//экспортируемый экземепляр класса EventBus
export const eventBus = new EventBus();
