export function install(spec: string, options?: Object | undefined, activate?: boolean | undefined): Promise<plugin>;
export function uninstall(name: string): Promise<boolean>;
export function getActive(): Promise<Array<plugin>>;
export function update(name: string): Promise<plugin>;
export function toggleActive(plugin: string, active: boolean): Promise<plugin>;
/**
 * A representation of a plugin in the renderer.
 */
export type plugin = {
    /**
     * Name of the package.
     */
    name: string;
    /**
     * The electron url where this plugin is located.
     */
    url: string;
    /**
     * List of activation points.
     */
    activationPoints: Array<string>;
    /**
     * Whether this plugin should be activated when its activation points are triggered.
     */
    active: boolean;
};
//# sourceMappingURL=index.d.ts.map