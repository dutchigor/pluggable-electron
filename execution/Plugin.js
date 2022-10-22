import { callExport } from "./import-manager"

export default class Plugin {
  /** @type {string} Name of the package. */
  name

  /** @type {string}  The electron url where this plugin is located. */
  url

  /** @type {Array<string>} List of activation points. */
  activationPoints

  /** @type {boolean} Whether this plugin should be activated when its activation points are triggered. */
  active

  constructor(name, url, activationPoints, active) {
    this.name = name
    this.url = url
    this.activationPoints = activationPoints
    this.active = active
  }

  triggerExport(exp) {
    callExport(this.url, exp, this.name)
  }
}