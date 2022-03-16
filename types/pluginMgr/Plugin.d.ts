export = Plugin;
/**
 * An NPM package that can be used as a Pluggable Electron plugin.
 * Used to hold all the information and functions necessary to handle the plugin lifecycle.
 * @extends Package
 * @property {string} origin Original specification provided to fetch the package.
 * @property {Object} installOptions Options provided to pacote when fetching the manifest.
 * @property {name} name The name of the plugin as defined in the manifest.
 * @property {string} url Electron URL where the package can be accessed.
 * @property {string} version Version of the package as defined in the manifest.
 * @property {Array<string>} activationPoints List of {@link ./Execution-API#activationPoints|activation points}.
 * @property {Array<{ package: string }>} dependencies A list of dependencies as defined in the manifest.
 * @property {string} main The entry point as defined in the main entry of the manifest.
 */
declare class Plugin extends Package {
    _active: boolean;
    _toUninstall: boolean;
    /**
     * Extract plugin to plugins folder.
     * @param {boolean} [addToStore=true] Whether to add the installed plugin to the store
     * @returns {Promise.<Plugin>} This plugin
     * @private
     */
    private _install;
    url: string | undefined;
    /**
     * Check for updates and install if available.
     * @returns {Plugin} This plugin
     */
    update(): Plugin;
    /**
     * Mark plugin for removal. It will then be removed the next time the plugin is initialised (as by initPlugin in the main process).
     * @returns {Plugin} This plugin
     */
    uninstall(): Plugin;
    /**
     * Set a plugin's active state. This determines if a plugin should be loaded on initialisation.
     * @param {boolean} active State to set _active to
     * @returns {Plugin} This plugin
     */
    setActive(active: boolean): Plugin;
}
import Package = require("./Package");
//# sourceMappingURL=Plugin.d.ts.map