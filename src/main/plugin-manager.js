const Plugin = require( "./Plugin"),
  router = require( "./router" ),
  store = require( "./store" )

module.exports.install = async ( spec, options ) => {
  const plugin = new Plugin( spec, options )

  try {
    // Install the plugin package in the plugins folder
    await plugin.install()
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
    plugin = store.getPlugin( plugin )
  }

  if ( !plugin ) {
    throw new Error( 'Unable to uninstall plugin. No active plugin found' )
  }

  plugin.uninstall()
  
  // Remove plugin from active list
  store.removePlugin( plugin.name )
}

// Initialise listeners
module.exports.init = ( options ) => {

  // Provide defaults for unset options
  defaults = store.getDefaults()
  const opts = { ...defaults, ...options }

  const plugins = store.setPluginsPath( opts.path )
  router.init( opts.useRoutes )
  return plugins
}
