const fs = require( "fs" ),
  path = require( "path" )

const Plugin = require( "./Plugin"),
  router = require( "./router" ),
  store = require( "./store" )

// Initialise Plugin Manager
module.exports.init = async ( options ) => {

  // Store the path to the plugins folder
  if ( typeof options.path === 'string')
    store.pluginsPath = options.path

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

  // Initialise IPC routes
  router.init( options.useRoutes )

  // Return a list of all plugins to be activated in the client
  return store.getActivePlugins()
}

// Get a list of Plugin objects by name
module.exports.getPlugins = store.getPlugins

// Save stored plugins to file
module.exports.persistPlugins = store.persistPlugins
