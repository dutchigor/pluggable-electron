const { ipcMain } = require( "electron" )

const pm = require( "./plugin-manager" ),
  store = require( "./store" )

// Register install IPC route
const routeInstall = channel => {
  ipcMain.handle( channel, ( e, package, options ) =>
    pm.install( package, options )
  )
}

// Register uninstall IPC route
const routeUninstall = channel => {
  ipcMain.handle( channel, ( e, package ) =>
    pm.uninstall( package )
  )
}

const routeGetPlugins = channel => {
  ipcMain.handle( channel, ( e, plugins ) =>
    store.getPlugins( plugins )
  )
}

// const routeGetActivePlugins = channel => {
//   ipcMain.handle( channel, () => store.getActivePlugins )
// }

const routeTogglePluginActive = channel => {
  ipcMain.handle( channel, ( e, plugin, active ) => {
    store.togglePluginActive( plugin, active )
    return store.getPlugins( [ plugin ] )
  })
}

// store of all available routes
const allRoutes = {
  install: { handle: routeInstall, channel: 'pluggable:install' },
  uninstall: { handle: routeUninstall, channel: 'pluggable:uninstall' },
  getPlugins: { handle: routeGetPlugins, channel: 'pluggable:getPlugins' },
  // getActivePlugins: {handle: routeGetActivePlugins, channel: 'pluggable:getActivePlugins'},
  togglePluginActive: { handle: routeTogglePluginActive, channel: 'pluggable:togglePluginActive'}
}

// intitialise module
module.exports.init = function ( routes ) {
  // Unregister existing handlers
  for ( route of Object.values( allRoutes ) ) {
    ipcMain.removeHandler( route.channel )
  }  

  // if routes is true, enable all routes
  if ( routes === true ) {
    for ( route of Object.values( allRoutes ) ) {
      route.handle( route.channel )
    }
  } 
  // If routes is an array, enable all routes included in array
  else if ( Array.isArray( routes ) ) {
    for ( route of routes ) {
      if ( allRoutes.hasOwnProperty( route ) ) allRoutes[route]()
    }
  }
}
