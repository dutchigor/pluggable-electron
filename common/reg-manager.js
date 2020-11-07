const ipc = require( 'electron' ).ipcRenderer

// Register provided plugins with their extension points
module.exports.regPlugins = plugins => {
  for ( const plugin of plugins ) {
    console.log( 'regActivePlugins', plugin)

    // Register plugin as active in the store if this is not already the case
    if ( !plugin.active ) {
      ipc.invoke( 'pluggable:togglePluginActive', plugin.name, true )
        .then( res => console.log( 'togglePluginActive', res ) )
    }
  }
}
