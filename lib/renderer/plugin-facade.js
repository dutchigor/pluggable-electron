/**
 * Helper functions to access the plugin management in the main process.
 * @namespace plugins
 */

const { ipcRenderer } = require( "electron" )
const Plugin = require( "./Plugin" )

/**
 * Install a new plugin.
 * @param {string} spec NPM package specifier of the plugin. Any form understood by NPM will work here.
 *     See [npm-install]{@link https://docs.npmjs.com/cli/v6/commands/npm-install}.
 * @param {Object} options The options passed to pacote to fetch the manifest, including version.
 * @returns {Plugin} New plugin
 * @alias plugins.install
 */
exports.install = ( spec, options ) => 
  ipcRenderer.invoke( 'pluggable:install', spec, options )
    .then( plg => new Plugin( plg.name, plg.path, plg.activationPoints, plg.active ) )

/**
 * Mark plugin for removal. It will then be removed the next time the plugin is intialised (as by initPlugin in the main process).
 * @param {string} name Name of the plugin to uninstall.
 * @returns {boolean} Whether marking the plugin was succesful
 * @alias plugins.uninstall
 */
exports.uninstall = name => 
  ipcRenderer.invoke( 'pluggable:uninstall', name )

/**
 * Fetch a list of all the active plugins.
 * @returns {Promise.<Array.<Plugin>>} List of plugin instances
 * @alias plugins.getActive
 */
exports.getActive = () => 
  ipcRenderer.invoke( 'pluggable:getActivePlugins' )
    .then( this.getInstances )

/**
 * Update a plugin to its latest version
 * @param {string} name Name of the plugin to update
 * @returns {Promise.<Plugin>} Updated plugin
 * @alias plugins.invoke
 */
exports.update = name =>
  ipcRenderer.invoke( 'pluggable:update', name )
    .then( plg => new Plugin( plg.name, plg.path, plg.activationPoints, plg.active ) )

// exports.initMain = installPath => {
//   ipcRenderer.invoke( 'pluggable:init', installPath )
//     .then( this.getInstances )
// }

/**
 * Toggle a plugin's active state. This determines if a plugin should be loaded in initialisation.
 * @param {Plugin} plugin Plugin to toggle
 * @param {boolean} active Whether plugin should be activated (true) or deactivated (false)
 * @returns {Plugin} Plugin with updated activation state
 * @alias plugins.toggleActive
 */
exports.toggleActive = ( plugin, active ) => 
  ipcRenderer.invoke( 'pluggable:togglePluginActive', plugin.name, active )
    .then( () => {
      plugin.active = active
      return plugin
    })

/**
 * Get a list of plugin instances based on a list of provided plugin details. Useful when receiving a list of PluginExports from the main process.
 * @param {Array.<PluginExport>} plugins List of plugin details
 * @returns List of plugin instances
 * @alias plugins.getInstances
 */
exports.getInstances = plugins => plugins.map( plg =>
  new Plugin( plg.name, plg.path, plg.activationPoints, plg.active)
)
