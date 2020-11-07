const fs = require( "fs" ),
  path = require( "path" )

const Plugin = require( "./Plugin"),
  router = require( "./router" ),
  store = require( "./store" )

module.exports.install = async ( spec, options ) => {
  const plugin = new Plugin( options )

  try {
    // Install the plugin package in the plugins folder
    await plugin.install( spec )
    store.addPlugin( plugin )
    return plugin

  } catch ( err ) {
    store.removePlugin( plugin.name )
    throw err
  }
}

// Uninstall plugin
module.exports.uninstall = async ( plugin ) => {
  if ( !( plugin instanceof Plugin ) ) {
    plugin = store.getPlugins( [ plugin ] )[0]
  }

  if ( !plugin ) {
    throw new Error( 'Unable to uninstall plugin. No active plugin found' )
  }

  plugin.uninstall()
  
  // Remove plugin from active list
  store.removePlugin( plugin.name )
}

// Initialise listeners
module.exports.init = async ( options ) => {

  // Provide defaults for unset options
  const opts = { ...store.getDefaults(), ...options }

  store.pluginsPath = opts.path

  const pluginsFile = path.join( opts.path, 'plugins.json' )

  if ( fs.existsSync( pluginsFile ) ) {
    const plugins = JSON.parse( fs.readFileSync( pluginsFile ) )
    try {
      for ( const name in plugins ) {
        const plugin = new Plugin()
        plugin.loadFromFile( plugins[name] )
        store.addPlugin( plugin, false )
      }
    } catch ( error ) {
      throw error // new Error( 'Could not successfully rebuild list of installed plugins. Please check the plugins.json file in the plugins folder' )
    }
  }

  router.init( opts.useRoutes )
  return store.getActivePlugins()
}

module.exports.getPlugins = store.getPlugins
