const am = require( "../common/activation-manager" ),
ipc = require( "./plugin-facade" )

/**
 * A representation of a plugin in the renderer. A plugin instance is used to register it with its activation points.
  * @property {string} name Name of the package
  * @property {string} path The folder where this plugin is located
  * @property {Array<string>} activationPoints List of activation points
  * @property {boolean} active Whether this plugin should be activated when its activation points are triggered
 */
class Plugin {
  constructor( name, path, activationPoints, active ) {
    this.name = name
    this.path = path
    this.activationPoints = activationPoints
    this.active = active
  }

  /**
   * Register this plugin with its activation points and set it to active.
   * This ensures that when this activation point is triggered, the relevant activation function will be called on this plugin.
   * @returns {void}
   */
  register() {
    for ( const ep of this.activationPoints ) {
      am.register( this.name, ep, this.path )
    }

    if ( !this.active ) {
      ipc.toggleActive( this, true )
    }
  }
}

module.exports = Plugin
