const { ipcMain } = require( "electron" )

const store = require( "./store" ),
  Plugin = require( "./Plugin" )

let active = false
/**
 * Provide the renderer process access to the plugins.
 **/
module.exports = () => {
  if ( active ) return
  // Register IPC route to install a plugin
  ipcMain.handle( 'pluggable:install', ( e, plg, options, activate = true ) => {
    const plugin = new Plugin( plg, options )
    plugin.setActive( activate )
    return plugin._install()
  })

  // Register IPC route to uninstall a plugin
  ipcMain.handle( 'pluggable:uninstall', ( e, plg ) => {
    const plugin = store.getPlugin( plg )
    plugin.uninstall()
    return true
  })

  // Register IPC route to update a plugin
  ipcMain.handle( 'pluggable:update', ( e, plg ) => {
    const plugin = store.getPlugin( plg )
    return plugin.update()
  })

  // Register IPC route to get the list of active plugins
  ipcMain.handle( 'pluggable:getActivePlugins', () => store.getActivePlugins() )

  // Register IPC route to toggle the active state of a plugin
  ipcMain.handle( 'pluggable:togglePluginActive', ( e, plg, active ) => {
    const plugin = store.getPlugin( plg )
    return plugin.setActive( active )
  })

  active = true
}
