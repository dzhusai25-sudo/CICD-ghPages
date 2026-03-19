declare global {
    var PRODUCTION: boolean;
    var PREFIX: string;
}
declare module './interfaces/Interfaces' {
    interface EventMap {
        'testEvent': [string, string];
        'unknown': [];
        'event1': [];
        'event2': [];
        'test': [];
    }
}
export {};
//# sourceMappingURL=runApp.test.d.ts.map