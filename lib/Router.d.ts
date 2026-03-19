import { Route, RouteHandler, MatchedRoute } from './interfaces/Interfaces';
export declare class Router {
    routes: Route[];
    currentRoute: string | null;
    basePath: string;
    constructor(basePath?: string);
    addRoute(path: string, handler: RouteHandler): void;
    findMatchingRoute(path: string): MatchedRoute | null;
    getFullPath(path: string): string;
    handleRoute(path?: string): Promise<void>;
    getCurrentPathWithoutBase(): string;
    init(): void;
    navigate(path: string): void;
}
//# sourceMappingURL=Router.d.ts.map