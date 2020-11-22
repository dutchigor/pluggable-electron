const fs = require( "fs" ),
  path = require( "path" )

const Plugin = require( "./Plugin" ),
  store = require( "./store" )

/**
 * Load plugins persisted in the plugin folder defined in pluginsPath.
 * @param {string} [pluginsPath] Optional path to the plugins folder
 * @returns {Promise.<Array.<Plugin>>} A list of active plugins
 * @function
 */
exports.loadPlugins = async ( pluginsPath ) => {  
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
        loadPlugin( plugins[name] )
      }
      store.persistPlugins()
    } catch ( error ) {
      // Throw meaningful error if plugin loading fails
      throw new Error( 'Could not successfully rebuild list of installed plugins. Please check the plugins.json file in the plugins folder' )
    }
  }

  // Return a list of all plugins to be activated in the client
  return store.getActivePlugins()
 }

// Create Plugin from an existing object
loadPlugin = plg => {
  if ( plg._toUninstall ) {
    // Remove plugin if it is set to be uninstalled
    fs.rmdirSync( plg.path, { recursive: true } )

  } else {
    // Create new plugin, populate it with plg details and save it to the store
    const plugin = new Plugin()

    for ( const key in plg ) {
      plugin[key] = plg[key]
    }

    store.addPlugin( plugin, false )
  }
}

/**
 * Create and install a new plugin for the given psecifier
 * @param {string} spec The specifier used to locate the package (from NPM or local file)
 * @param {Object} [options] Optional options passed to pacote to fetch the manifest
 * @returns {Plugin} New plugin
 */
exports.installPlugin = async ( spec, options ) => {
  const plugin = new Plugin( spec, options )
  return await plugin._install()
}