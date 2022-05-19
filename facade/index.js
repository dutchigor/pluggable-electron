/**
 * Helper functions to access the plugin management in the main process.
 * Note that the facade needs to be imported separately as "pluggable-electron/facade" as described above.
 * It is then available on the global window object as describe in the {@link https://www.electronjs.org/docs/api/context-bridge|Electron documentation}
 * @namespace facade
 */

/**
 * @typedef {Object} Plugin A representation of a plugin in the renderer.
 * @property {string} name Name of the package.
 * @property {string} url The electron url where this plugin is located.
 * @property {Array<string>} activationPoints List of activation points.
 * @property {boolean} active Whether this plugin should be activated when its activation points are triggered.
 */

import { ipcRenderer } from "electron"

/**
 * Install a new plugin.
 * @param {string} spec NPM package specifier of the plugin. Any form understood by NPM will work here.
 *     See [npm-install]{@link https://docs.npmjs.com/cli/v6/commands/npm-install}.
 * @param {Object} [options] The options passed to {@link https://www.npmjs.com/package/pacote|pacote} to fetch the manifest, including version.
 * @param {boolean} [activate=true] Whether the plugin should be activated on install.
 * @returns {Promise.<Plugin>} plugin as defined by the main process. Has property cancelled set to true if installation was cancelled in the main process.
 * @alias facade.install
 */
export function install(spec, options, activate) { return ipcRenderer.invoke('pluggable:install', spec, options, activate) }

/**
 * Mark plugin for removal. It will then be removed the next time the plugin is initialised (as by setupPlugins in the main process).
 * @param {string} name Name of the plugin to uninstall.
 * @returns {Promise.<boolean>} Whether marking the plugin was successful.
 * @alias facade.uninstall
 */
export function uninstall(name) { return ipcRenderer.invoke('pluggable:uninstall', name) }

/**
 * Fetch a list of all the active plugins.
 * @returns {Promise.<Array.<Plugin>>} List of plugins as defined by the main process.
 * @alias facade.getActive
 */
export function getActive() { return ipcRenderer.invoke('pluggable:getActivePlugins') }

/**
 * Update a plugin to its latest version.
 * @param {string} name Name of the plugin to update.
 * @returns {Promise.<Plugin>} Updated plugin as defined by the main process.
 * @alias facade.update
 */
export function update(name) { return ipcRenderer.invoke('pluggable:update', name) }

/**
 * Toggle a plugin's active state. This determines if a plugin should be loaded in initialisation.
 * @param {String} plugin Plugin to toggle.
 * @param {boolean} active Whether plugin should be activated (true) or deactivated (false).
 * @returns {Promise.<plugin>} Updated plugin as defined by the main process.
 * @alias facade.toggleActive
 */
export function toggleActive(plugin, active) { return ipcRenderer.invoke('pluggable:togglePluginActive', plugin, active) }
