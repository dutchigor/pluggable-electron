const epm = require( "./extension-manager" )

/**
 * A representation of a plugin's registration to an activation point
 * @private
 */
module.exports = class Activation {
  /**
   * Create an activation
   * @param {string} plugin Name of the registered plugin
   * @param {string} activationPoint Name of the activation point registered to
   * @param {string} path Path to be required when triggering the activation point
   * @param {boolean} activated Whether the activation has been activated
   * @returns {void}
   */
  constructor( plugin, activationPoint, path ) {
    this.plugin = plugin
    this.activationPoint = activationPoint
    this.path = path
    this.activated = false
  }

  /**
   * Trigger the activation function in the plugin once,
   * providing the list of extension points as input
   * @param {boolean} passEps Whether to include the extension points as a parameter in the trigger
   * @returns {void}
   */
  trigger( passEps ) {
    if ( this.activated ) return
    const main = require( this.path )
    if ( typeof main[ this.activationPoint ] === 'function' ) {
      main[ this.activationPoint ]( passEps ? epm.get() : null )
    }
    this.activated = true
  }
}