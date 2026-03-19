import { EventMap } from "./interfaces/Interfaces";
type EventCallback<T extends keyof EventMap> = (...args: EventMap[T]) => void;
export declare class EventBus {
    private events;
    constructor();
    on<T extends keyof EventMap>(eventName: T, callback: EventCallback<T>): void;
    off<T extends keyof EventMap>(eventName: T, callback: EventCallback<T>): void;
    emit<T extends keyof EventMap>(eventName: T, ...args: EventMap[T]): void;
}
export declare const eventBus: EventBus;
export {};
//# sourceMappingURL=EventBus.d.ts.map