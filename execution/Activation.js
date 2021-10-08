import * as em from "./extension-manager.js"

/**
 * A representation of a plugin's registration to an activation point
 * @private
 */
class Activation {
  /**
   * Create an activation
   * @param {string} plugin Name of the registered plugin.
   * @param {string} activationPoint Name of the activation point that is registered to.
   * @param {string} url location of the file containing the activation function.
   * @param {importer} importer Used to import the entry point.
   * @param {boolean} activated Whether the activation has been activated.
   * @returns {void}
   */
  constructor(plugin, activationPoint, url, importer) {
    this.plugin = plugin
    this.activationPoint = activationPoint
    this.url = url
    this.importer = importer
    this.activated = false
  }

  /**
   * Trigger the activation function in the plugin once,
   * providing the list of extension points or an object with the extension point's register, execute and executeSerial functions.
   * @param {boolean} presetEPs Whether the Extension Points have been predefined or can be created on the fly.
   * @returns {boolean} Whether the activation has already been activated.
   */
  async trigger(presetEPs) {
    if (!this.activated) {
      const main = await this.importer(this.url, this.plugin)
      const epRegister = presetEPs ? em.get() :
        { register: em.register, execute: em.execute, executeSerial: em.executeSerial }
      main[this.activationPoint](epRegister)
      this.activated = true
    }
    return this.activated
  }
}

export default Activation
