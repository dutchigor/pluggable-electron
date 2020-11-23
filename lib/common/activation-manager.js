/**
 * This object contains a register of activations and the means to work with it
 * @namespace activation
 */

const Activation = require("./Activation")

/** 
 * @constant {Array.<activation>} activationRegister
 * @private
 * Register of activations used by the consumer
 */
const activationRegister = []

/**
 * Register an activation
 * @param {string} plugin Name of the plugin to register
 * @param {string} activationPoint Name of the activation point to register to
 * @param {string} path Path to be required when triggering the activation point
 * @returns {void}
 * @private
 */
module.exports.register = ( plugin, activationPoint, path ) => {
  // Ensure plugin is not already registered to activation point
  const duplicate = activationRegister.findIndex( act => 
    act.plugin === plugin && act.activationPoint === activationPoint
  )

  // Create new activation and add it to the register
  if ( duplicate < 0 ) activationRegister.push( new Activation( plugin, activationPoint, path ) )
}

/**
 * Trigger all activations registered to the given activation point. See {@link Plugin}.
 * This will call the function with the same name as the activation point on the path specified in the plugin.
 * @param {string} activationPoint Name of the activation to trigger
 * @param {boolean} passEps Whether to include the extension points as a parameter in the trigger
 * @returns {void}
 * @alias activation.trigger
 */
module.exports.trigger = ( activationPoint, passEps = true ) => {
  activationRegister.forEach( act => {
     if ( act.activationPoint === activationPoint ) {
      act.trigger( passEps )
     }
  })
}
