const fs = require( "fs" ),
  path = require( "path" )

const Plugin = require( "./Plugin"),
  router = require( "./router" ),
  store = require( "./store" )

// Install a new plugin
module.exports.install = async ( spec, options ) => {
  const plugin = new Plugin( options )

  try {
    // Install the plugin package in the plugins folder
    await plugin.install( spec )
    store.addPlugin( plugin )
    return plugin

  } catch ( err ) {
    // Ensure the plugin is not stored if the installation fails
    store.removePlugin( plugin.name )
    throw err
  }
}

// Uninstall plugin
module.exports.uninstall = async ( plugin ) => {
  // Ensure plugin is (converted to) an instance of Plugin or throw an error
  if ( !( plugin instanceof Plugin ) ) {
    plugin = store.getPlugins( [ plugin ] )[0]
  }

  if ( !plugin ) {
    throw new Error( 'Unable to uninstall plugin. No active plugin found' )
  }

  // Remove plugin from plugins folder
  plugin.uninstall()
  
  // Remove plugin from active list
  store.removePlugin( plugin.name )
}

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
      // Create and store a Plugin instance for each plugin in list
      for ( const name in plugins ) {
        const plugin = new Plugin()
        plugin.loadPkg( plugins[name] )
        store.addPlugin( plugin, false )
      }
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
