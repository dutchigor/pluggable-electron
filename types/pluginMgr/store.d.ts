export var pluginsPath: string | null | undefined;
export function setPluginsPath(plgPath: string): void;
export function getPluginsFile(): string;
export function getPlugin(name: string): Plugin;
export function getAllPlugins(): Array<Plugin>;
export function getActivePlugins(): Array<Plugin>;
export function removePlugin(name: string, persist?: boolean): boolean;
export function addPlugin(plugin: Plugin, persist?: boolean): void;
export function persistPlugins(): void;
export function installPlugin(spec: string, options?: Object | undefined): Plugin;
/**
 * This function is executed when a plugin is installed to verify that the user indeed wants to install the plugin.
 */
export type confirmInstall = (plg: string) => boolean;
export function confirmInstall(plg: any): Error;
//# sourceMappingURL=store.d.ts.map