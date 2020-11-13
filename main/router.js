const { ipcMain } = require( "electron" )

const store = require( "./store" ),
  Plugin = require( "./Plugin" )

// intitialise module
module.exports = () => {
  // Register IPC route to install a plugin
  ipcMain.handle( 'pluggable:install', ( e, plg, options ) => {
    return Plugin.install( plg, options )
  })

  // Register IPC route to uninstall a plugin
  ipcMain.handle( 'pluggable:uninstall', ( e, plg ) => {
    const plugin = store.getPlugin( plg )
    plugin.uninstall = true
    plugin.active = false
    store.persistPlugins()
    return plugin
  })

  // Register IPC route to update a plugin
  ipcMain.handle( 'pluggable:update', ( e, plg ) => {
    const plugin = store.getPlugin( plg )
    return plugin.update()
  })

  // Register IPC route to get a list of plugins by name
  // ipcMain.handle( 'pluggable:getPlugins', ( e, plugins ) =>
  //   store.getPlugins( plugins )
  // )

  // Register IPC route to get the list of active plugins
  ipcMain.handle( 'pluggable:getActivePlugins', () => store.getActivePlugins() )

  // Register IPC route to toggle the active state of a plugin
  ipcMain.handle( 'pluggable:togglePluginActive', ( e, plg, active ) => {
    const plugin = store.getPlugin( plg )
    plugin.active = active
    store.persistPlugins()
    return plugin
  })
}
