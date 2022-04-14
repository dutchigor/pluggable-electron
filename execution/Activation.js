import { get as getEPs, register, execute, executeSerial } from "./extension-manager.js"

/**
 * A representation of a plugin's registration to an activation point
 * @private
 */
class Activation {
  /**
   * Create an activation
   * @param {importer} importer Used to import the entry point.
   * @param {string} plugin Name of the registered plugin.
   * @param {string} activationPoint Name of the activation point that is registered to.
   * @param {string} url location of the file containing the activation function.
   * @param {boolean} activated Whether the activation has been activated.
   * @returns {void}
   */
  static importer

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
