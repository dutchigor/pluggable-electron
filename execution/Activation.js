import { get as getEPs } from "./extension-manager.js"

/**
 * A representation of a plugin's registration to an activation point
 * @private
 */
export default class Activation {
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
   * providing the list of extension points as input.
   * @param {boolean} passEps Whether to include the extension points as a parameter in the trigger.
   * @returns {boolean} Whether the activation has been activated.
   */
  async trigger(passEps) {
    if (!this.activated) {
      // try {
      const main = await this.importer(this.url, this.plugin)
      const extensionPoints = passEps ? getEPs() : null
      main[this.activationPoint](extensionPoints)
      this.activated = true
      // } catch {
      //   console.error(`Plugin ${this.plugin} does not exist or does not contain an activation function for ${this.activationPoint}`)
      // }
    }
    return this.activated
  }
}
