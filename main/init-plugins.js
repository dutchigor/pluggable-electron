const fs = require( "fs" ),
  path = require( "path" )

const Plugin = require( "./Plugin"),
  store = require( "./store" )

// Initialise Plugin Manager
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
  return store.getActivePlugins()
}
