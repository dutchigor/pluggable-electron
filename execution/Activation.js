import { get as getEPs, register, execute, executeSerial } from "./extension-manager.js"

/**
 * Used to import a plugin entry point.
 * Ensure your bundler does no try to resolve this import as the plugins are not known at build time.
 * @callback importer
 * @param {string} entryPoint File to be imported.
 * @returns {module} The module containing the entry point function.
 */

/**
 * A representation of a plugin's registration to an activation point
 * @prop {importer} importer Used to import the entry point.
 */
class Activation {
  static importer

  /** @type {string} Name of the registered plugin. */
  plugin

  /** @type {string} Name of the activation point that is registered to. */
  activationPoint

  /** @type {string} location of the file containing the activation function. */
  url
  /** @type {boolean} Whether the activation has been activated. */
  activated

  constructor(plugin, activationPoint, url) {
    this.plugin = plugin
    this.activationPoint = activationPoint
    this.url = url
    this.activated = false
  }

  /**
   * Trigger the activation function in the plugin once,
   * providing the list of extension points or an object with the extension point's register, execute and executeSerial functions.
   * @param {boolean|null} presetEPs Whether the Extension Points have been predefined (true),
   *  can be created on the fly(false) or should not be provided through the input at all (null).
   * @returns {boolean} Whether the activation has already been activated.
   */
  async trigger(presetEPs) {
    if (!Activation.importer) throw new Error('Importer callback has not been set')

    if (!this.activated) {
      const main = await Activation.importer(this.url, this.plugin)
      if (!main || typeof main[this.activationPoint] !== 'function') {
        throw new Error(`Activation point "${this.activationPoint}" was triggered but does not exist on plugin ${this.plugin}`)
      }
      const activate = main[this.activationPoint]
      switch (presetEPs) {
        case true:
          activate(getEPs())
          break

        case null:
          activate()
          break

        default:
          activate({ register, execute, executeSerial })
          break;
      }
      this.activated = true
    }
    return this.activated
  }
}

export default Activation
