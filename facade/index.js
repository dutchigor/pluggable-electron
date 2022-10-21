/**
 * Helper functions to access the plugin management in the main process.
 * Note that the facade needs to be imported separately as "pluggable-electron/facade" as described above.
 * It is then available on the global window object as describe in the {@link https://www.electronjs.org/docs/api/context-bridge|Electron documentation}
 * @namespace facade
 */

/**
 * @typedef {Object} plugin A representation of a plugin in the renderer.
 * @property {string} name Name of the package.
 * @property {string} url The electron url where this plugin is located.
 * @property {Array<string>} activationPoints List of activation points.
 * @property {boolean} active Whether this plugin should be activated when its activation points are triggered.
 */

/**
 * @typedef {Object.<string, any>} installOptions The {@link https://www.npmjs.com/package/pacote|pacote options}
 * used to install the plugin.
 * @param {string} specifier the NPM specifier that identifies the package.
 * @param {boolean} [activate=true] Whether this plugin should be activated after installation.
 */

import { ipcRenderer } from "electron"

/**
 * Install a new plugin.
 * @param {Array.<installOptions | string>} plugins A list of NPM specifiers, or installation configuration objects.
 * @returns {Promise.<plugin>} plugin as defined by the main process. Has property cancelled set to true if installation was cancelled in the main process.
 * @alias facade.install
 */
export function install(plugins) { return ipcRenderer.invoke('pluggable:install', plugins) }

/**
 * Uninstall provided plugins
 * @param {Array.<string>} plugins List of names of plugins to uninstall.
 * @param {boolean} reload Whether to reload all renderers after updating the plugins.
 * @returns {Promise.<boolean>} Whether marking the plugin was successful.
 * @alias facade.uninstall
 */
export function uninstall(plugins, reload) { return ipcRenderer.invoke('pluggable:uninstall', plugins, reload = true) }

/**
 * Fetch a list of all the active plugins.
 * @returns {Promise.<Array.<plugin>>} List of plugins as defined by the main process.
 * @alias facade.getActive
 */
export function getActive() { return ipcRenderer.invoke('pluggable:getActivePlugins') }

/**
 * Update provided plugins to its latest version.
 * @param {Array.<string>} plugins List of plugins to update by name.
 * @param {boolean} reload Whether to reload all renderers after updating the plugins.
 * @returns {Promise.<plugin>} Updated plugin as defined by the main process.
 * @alias facade.update
 */
export function update(plugins, reload = true) { return ipcRenderer.invoke('pluggable:update', plugins, reload) }

/**
 * Check if an update is available for provided plugins.
 * @param {Array.<string>} plugin List of plugin names to check for available updates.
 * @returns {Object.<string | false>} Object with plugins as keys and new version if update is available or false as values.
 */
export function updatesAvailable(plugin) { return ipcRenderer.invoke('pluggable:updatesAvailable', plugin) }

/**
 * Toggle a plugin's active state. This determines if a plugin should be loaded in initialisation.
 * @param {String} plugin Plugin to toggle.
 * @param {boolean} active Whether plugin should be activated (true) or deactivated (false).
 * @returns {Promise.<plugin>} Updated plugin as defined by the main process.
 * @alias facade.toggleActive
 */
export function toggleActive(plugin, active) { return ipcRenderer.invoke('pluggable:togglePluginActive', plugin, active) }
