/**
 * Helper functions to access the plugin management in the main process.
 * @namespace facade
 */

/**
 * @typedef {Object} plugin A representation of a plugin in the renderer.
 * @property {string} name Name of the package.
 * @property {string} url The electron url where this plugin is located.
 * @property {Array<string>} activationPoints List of activation points.
 * @property {boolean} active Whether this plugin should be activated when its activation points are triggered.
 */

const { ipcRenderer } = require("electron")

/**
 * Install a new plugin.
 * @param {string} spec NPM package specifier of the plugin. Any form understood by NPM will work here.
 *     See [npm-install]{@link https://docs.npmjs.com/cli/v6/commands/npm-install}.
 * @param {Object} [options] The options passed to pacote to fetch the manifest, including version.
 * @param {boolean} [activate=true] Whether the plugin should be activated on install.
 * @returns {Promise.<plugin>} plugin as defined by the main process. Has property cancelled set to true if installation was cancelled in the main process.
 * @alias facade.install
 */
exports.install = (spec, options, activate) =>
  ipcRenderer.invoke('pluggable:install', spec, options, activate)

/**
 * Mark plugin for removal. It will then be removed the next time the plugin is initialised (as by setupPlugins in the main process).
 * @param {string} name Name of the plugin to uninstall.
 * @returns {Promise.<boolean>} Whether marking the plugin was successful.
 * @alias facade.uninstall
 */
exports.uninstall = name =>
  ipcRenderer.invoke('pluggable:uninstall', name)

/**
 * Fetch a list of all the active plugins.
 * @returns {Promise.<Array.<plugin>>} List of plugins as defined by the main process.
 * @alias facade.getActive
 */
exports.getActive = () =>
  ipcRenderer.invoke('pluggable:getActivePlugins')

/**
 * Update a plugin to its latest version.
 * @param {string} name Name of the plugin to update.
 * @returns {Promise.<plugin>} Updated plugin as defined by the main process.
 * @alias facade.update
 */
exports.update = name =>
  ipcRenderer.invoke('pluggable:update', name)

/**
 * Toggle a plugin's active state. This determines if a plugin should be loaded in initialisation.
 * @param {String} plugin Plugin to toggle.
 * @param {boolean} active Whether plugin should be activated (true) or deactivated (false).
 * @returns {plugin} Updated plugin as defined by the main process.
 * @alias facade.toggleActive
 */
exports.toggleActive = (plugin, active) =>
  ipcRenderer.invoke('pluggable:togglePluginActive', plugin, active)
