import Activation from "./Activation.js"

/**
 * This object contains a register of activations and the means to work with it
 * @namespace activation
 */

/**
 * @callback importer Used to import a plugin entry point.
 * Ensure your bundler does no try to resolve this import as the plugins are not known at build time.
 * @param {string} entryPoint File to be imported 
 */

/**
 * Store setup options
 */
let importer
let presetEPs

/**
 * Set the renderer options for pluggable electron.
 * @param {Object} options
 * @param {importer} options.importer The callback function used to import the plugin entry points.
 * @param {Boolean} [options.presetEPs=false] Whether the Extension Points have been predefined or can be created on the fly.
 */
export function setup(options) {
  importer = options.importer
  presetEPs = options.hasOwnProperty('presetEPs') ? options.presetEPs : false
}

/** 
 * @constant {Array.<activation>} activationRegister
 * @private
 * Store of activations used by the consumer
 */
const activationRegister = []

/**
 * Register the activation points for a plugin.
 * @param {plugin} plugin plugin object as provided by the main process.
 * @returns {void}
 * @alias activation.register
 */
export function register(plugin) {
  if (!importer) throw new Error('Importer callback has not been set')
  if (!Array.isArray(plugin.activationPoints)) throw new Error(
    `Plugin ${plugin.name || 'without name'} does not have any activation points set up in its manifest.`
  )
  for (const ap of plugin.activationPoints) {
    // Ensure plugin is not already registered to activation point
    const duplicate = activationRegister.findIndex(act =>
      act.plugin === plugin.name && act.activationPoint === ap
    )

    // Create new activation and add it to the register
    if (duplicate < 0) activationRegister.push(new Activation(plugin.name, ap, plugin.url, importer))
  }
}

/**
 * Trigger all activations registered to the given activation point. See {@link Plugin}.
 * This will call the function with the same name as the activation point on the path specified in the plugin.
 * @param {string} activationPoint Name of the activation to trigger
 * @returns {void}
 * @alias activation.trigger
 */
export function trigger(activationPoint) {
  activationRegister.forEach(act => {
    if (act.activationPoint === activationPoint) {
      act.trigger(presetEPs)
    }
  })
}
