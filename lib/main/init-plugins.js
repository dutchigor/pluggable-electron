/**
 * @typedef PluginExport
 * @description A simplified representation of the plugin, to be used to pass to the renderer or other external references to the plugin
 * @property {string} name Name of the package 
 * @property {string} path The folder where this plugin is located
 * @property {Array<string>} activationPoints List of activation points.
 * @property {boolean} active Whether this plugin should be activated when its activation points are triggered
 */

const fs = require( "fs" ),
  path = require( "path" )

const Plugin = require( "./Plugin"),
  store = require( "./store" )

/**
 * Load plugins persisted in the plugin folder defined in pluginsPath.
 * @param {string} [pluginsPath] Path to the plugins folder
 * @returns {Promise.<Array.<PluginExport>>} A list of active plugins
 * @namespace initPlugins
 * @function
 */
module.exports = async ( pluginsPath ) => {  
  // Store the path to the plugins folder
  store.pluginsPath = pluginsPath

  // Remove any registered plugins
  for ( const plugin of store.getAllPlugins() ) {
    store.removePlugin( plugin.name )
  }

  // Read plugin list from plugins folder
  const pluginsFile = path.join( store.pluginsPath, 'plugins.json' )

  if ( fs.existsSync( pluginsFile ) ) {
    const plugins = JSON.parse( fs.readFileSync( pluginsFile ) )
    try {
      // Create a Plugin instance for each plugin in list
      for ( const name in plugins ) {
        Plugin.loadPkg( plugins[name] )
      }
      store.persistPlugins()
    } catch ( error ) {
      // Throw meaningful error if plugin loading fails
      throw new Error( 'Could not successfully rebuild list of installed plugins. Please check the plugins.json file in the plugins folder' )
    }
  }

  // Return a list of all plugins to be activated in the client
  return store.getActivePlugins().map( plg => { return {
    name: plg.name,
    path: plg.path,
    activationPoints: plg.activationPoints,
    active: plg.active
  }})
 }
