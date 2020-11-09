module.exports = class Activation {
  plugin
  activationPoint
  path

  constructor( plugin, activationPoint, path ) {
    this.plugin = plugin
    this.activationPoint = activationPoint
    this.path = path
  }

  trigger( extensionPoints ) {
    const main = require( this.path )
    if ( typeof main[ this.activationPoint ] === 'function' ) {
      main[ this.activationPoint ]( extensionPoints )
    }
  }
}