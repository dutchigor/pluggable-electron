const ipc = require( 'electron' ).ipcRenderer

module.exports.regPlugins = plugins => {
  for ( const plugin of plugins ) {
    console.log( 'regActivePlugins', plugin)
    if ( !plugin.active ) {
      ipc.invoke( 'pluggable:togglePluginActive', plugin.name, true )
        .then( res => console.log( 'togglePluginActive', res ) )
    }
  }
}
