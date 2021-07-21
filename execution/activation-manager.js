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
 * @type {importer}
 */
let importer

/**
 * Set the callback function used to import the plugin entry points.
 * @param {importer} importerCb
 */
export function setImporter(importerCb) {
  importer = importerCb
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
  for (const ep of plugin.activationPoints) {
    // Ensure plugin is not already registered to activation point
    const duplicate = activationRegister.findIndex(act =>
      act.plugin === plugin.name && act.activationPoint === ep
    )

    // Create new activation and add it to the register
    if (duplicate < 0) activationRegister.push(new Activation(plugin.name, ep, plugin.url, importer))
  }
}

/**
 * Trigger all activations registered to the given activation point. See {@link Plugin}.
 * This will call the function with the same name as the activation point on the path specified in the plugin.
 * @param {string} activationPoint Name of the activation to trigger
 * @param {boolean} [passEps=true] Whether to include the extension points as a parameter in the trigger.
 * @returns {void}
 * @alias activation.trigger
 */
export function trigger(activationPoint, passEps = true) {
  activationRegister.forEach(act => {
    if (act.activationPoint === activationPoint) {
      act.trigger(passEps)
    }
  })
}
