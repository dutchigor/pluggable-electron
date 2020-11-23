const { app } = require( "electron" ),
  fs = require( "fs" ),
  path = require( "path" )

/**
 * @constant {string} pluginsPath Path to the plugins folder
 * @private
 **/
module.exports.pluginsPath = path.join( app.getPath( 'appData' ), 'plugins' )

// Register of installed plugins
const plugins = {}

/**
 * Get a plugin from the stored plugins
 * @param {string} name Name of the plugin to retreive
 * @returns {Plugin} Retrieved plugin
 * @alias register.getPlugin
 */
module.exports.getPlugin = ( name ) => {
  if ( !plugins.hasOwnProperty( name ) ) {
    throw new Error( `Plugin ${name} does not exist` )
  }

  return plugins[name]
}

/**
 * Get list of all plugin objects
 * @returns {Array.<Plugin>} All plugin objects
 * @alias register.getAllPlugins
 */
module.exports.getAllPlugins = () => Object.values( plugins )

/**
 * Get list of active plugin objects
 * @returns {Array.<Plugin>} Active plugin objects
 * @alias register.getActivePlugins
 */
module.exports.getActivePlugins = () =>
Object.values( plugins ).filter( plugin => plugin._active )

/**
 * @private
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
 * @private
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
 * @private
 * Save stored plugins to file
 * @returns {void}
 */
module.exports.persistPlugins = () => {
  const filename = path.join( this.pluginsPath, 'plugins.json' )
  fs.writeFileSync( filename, JSON.stringify( plugins ), 'utf8' )
}
