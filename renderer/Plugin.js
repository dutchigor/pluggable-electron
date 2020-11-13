const am = require( "../common/activation-manager" ),
ipc = require( "./ipc-handler" )

module.exports = class Plugin {
  name
  path
  activationPoints
  active

  constructor( name, path, activationPoints, active ) {
    this.name = name
    this.path = path
    this.activationPoints = activationPoints
    this.active = active
  }

  register() {
    for ( const ep of this.activationPoints ) {
      am.register( this.name, ep, this.path )
    }

    // Register plugin as active in the store if this is not already the case
    if ( !this.active ) {
      ipc.togglePluginActive( this, true )
    }
  }
}