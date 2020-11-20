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
   * @returns {void}
   */
  constructor( plugin, activationPoint, path ) {
    this.plugin = plugin
    this.activationPoint = activationPoint
    this.path = path
  }

  /**
   * Trigger the activation function in the plugin
   * @param {Object.<string, ExtensionPoint>} extensionPoints
   *    Register of extension points for the plugin to access
   * @returns {void}
   */
  trigger( extensionPoints ) {
    const main = require( this.path )
    if ( typeof main[ this.activationPoint ] === 'function' ) {
      main[ this.activationPoint ]( extensionPoints )
    }
  }
}
