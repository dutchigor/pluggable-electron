const am = require( "./activation-manager" )

module.exports = class PluginList {
  plugins
  constructor( plugins ) {
    this.plugins = plugins
  }

  register() {
    for ( const plugin of this.plugins ) {
      for ( const ep of plugin.activationPoints ) {
        am.register( plugin.name, ep, plugin.path )
      }

      // Register plugin as active in the store if this is not already the case
      if ( !plugin.active ) {
        ipc.invoke( 'pluggable:togglePluginActive', plugin.name, true )
          .then( res => console.log( 'togglePluginActive', res ) )
      }
    }

  }
}