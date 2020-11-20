/**
 * Provides access to the data stored by Pluggable Electron
 * @module main/store
 * @private
 */

const { app } = require( "electron" ),
  fs = require( "fs" ),
  path = require( "path" )

/** @constant {string} pluginsPath Path to the plugins folder */
module.exports.pluginsPath = path.join( app.getPath( 'appData' ), 'plugins' )

/** @constant {Object.<string, Plugin>} plugins Register of installed plugins */
const plugins = {}

/**
 * Get a plugin from the stored plugins
 * @param {string} name Name of the plugin to retreive
 * @returns {Plugin} Retreived plugin
 */
module.exports.getPlugin = ( name ) => {
  if ( typeof plugins[name] !== 'object' ) {
    throw new Error( `Plugin ${name} does not exist` )
  }

  return plugins[name]
}

/**
 * Get list of all plugin objects
 * @returns {Array.<Plugin>} All plugin objects
 */
module.exports.getAllPlugins = () => Object.values( plugins )

/**
 * Get list of active plugin objects
 * @returns {Array.<Plugin>} Active plugin objects
 */
module.exports.getActivePlugins = () =>
Object.values( plugins ).filter( plugin => plugin.active )

/**
 * Remove plugin from store and maybe save stored plugins to file
 * @param {string} name Name of the plugin to remove
 * @param {boolean} persist Whether to save the changes to plugins to file
 * @returns {boolean} Whether the delete was successful
 */
module.exports.removePlugin = ( name, persist = true ) => {
  const del = delete plugins[name]
  if ( persist ) this.persistPlugins()
  return del
}

/**
 * Add plugin to store and maybe save stored plugins to file
 * @param {Plugin} plugin Plugin to add to store
 * @param {boolean} persist Whether to save the changes to plugins to file
 * @returns {void}
 */
module.exports.addPlugin = ( plugin, persist = true ) => {
  plugins[plugin.name] = plugin
  if ( persist ) this.persistPlugins()
}

/**
 * Save stored plugins to file
 * @returns {void}
 */
module.exports.persistPlugins = () => {
  const filename = path.join( this.pluginsPath, 'plugins.json' )
  fs.writeFileSync( filename, JSON.stringify( plugins ), 'utf8' )
}
