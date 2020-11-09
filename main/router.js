const { ipcMain } = require( "electron" )

const store = require( "./store" ),
  Plugin = require( "./Plugin" )

// Register IPC route to install a plugin
const routeInstall = channel => {
  ipcMain.handle( channel, ( e, plg, options ) => {
    const plugin = Plugin.install( plg, options )
    return plugin
  })
}

// Register IPC route to uninstall a plugin
const routeUninstall = channel => {
  ipcMain.handle( channel, ( e, plg ) => {
    const plugin = store.getPlugin( plg )
    plugin.uninstall = true
    plugin.active = false
    store.persistPlugins()
    return plugin
  })
}

// Register IPC route to uninstall a plugin
const routeUpdate = channel => {
  ipcMain.handle( channel, ( e, plg ) => {
    const plugin = store.getPlugin( plg )
    return plugin.update()
  })
}

// Register IPC route to get a list of plugins by name
// const routeGetPlugins = channel => {
//   ipcMain.handle( channel, ( e, plugins ) =>
//     store.getPlugins( plugins )
//   )
// }

// Register IPC route to get the list of active plugins
const routeGetActivePlugins = channel => {
  ipcMain.handle( channel, () => store.getActivePlugins() )
}

// Register IPC route to toggle the active state of a plugin
const routeTogglePluginActive = channel => {
  ipcMain.handle( channel, ( e, plg, active ) => {
    const plugin = store.getPlugin( plg )
    plugin.active = active
    store.persistPlugins()
    return plugin
  })
}

// store of all available routes
const allRoutes = {
  install: { handle: routeInstall, channel: 'pluggable:install' },
  uninstall: { handle: routeUninstall, channel: 'pluggable:uninstall' },
  update: { handle: routeUpdate, channel: 'pluggable:update' },
  // getPlugins: { handle: routeGetPlugins, channel: 'pluggable:getPlugins' },
  getActivePlugins: {handle: routeGetActivePlugins, channel: 'pluggable:getActivePlugins'},
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
      if ( allRoutes.hasOwnProperty( route ) ) allRoutes[route].handle()
    }
  }
}
