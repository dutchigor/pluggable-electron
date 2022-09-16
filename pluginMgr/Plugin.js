import { manifest } from "pacote"

import Package from "./Package"
import { pluginsPath } from "./globals"

/** 
 * An NPM package that can be used as a Pluggable Electron plugin.
 * Used to hold all the information and functions necessary to handle the plugin lifecycle.
 * @extends Package
 * @property {string} origin Original specification provided to fetch the package.
 * @property {Object} installOptions Options provided to pacote when fetching the manifest.
 * @property {name} name The name of the plugin as defined in the manifest.
 * @property {string} url Electron URL where the package can be accessed.
 * @property {string} version Version of the package as defined in the manifest.
 * @property {Array<string>} activationPoints List of {@link ./Execution-API#activationPoints|activation points}.
 * @property {Array<{ package: string }>} dependencies A list of dependencies as defined in the manifest.
 * @property {string} main The entry point as defined in the main entry of the manifest.
 * @property {{[string]: Function}} _listeners A list of callbacks to be executed when the Plugin is updated.
 */
class Plugin extends Package {
  _active = false
  _toUninstall = false
  _listeners = {}

  /**
   * Extract plugin to plugins folder.
   * @returns {Promise.<Plugin>} This plugin
   * @private
   */
  async _install() {
    try {
      // Install the plugin package in the plugins folder
      await this._installPkg(pluginsPath)

      if (typeof this.activationPoints !== 'object')
        throw new Error('The plugin does not contain any activation points')

      // Set the url using the custom plugins protocol
      this.url = `plugin://${this.name}/${this.main}`

      // Install all the plugin dependencies in the plugin's node_modules folder
      // var modulesPath = path.join(store.pluginsPath, this.name, 'node_modules')
      // fs.rmdirSync(modulesPath, { recursive: true })
      // await this._installDeps(modulesPath)

    } catch (err) {
      // Ensure the plugin is not stored and the folder is removed if the installation fails
      this._active = false
      throw err
    }

    return this
  }

  /**
   * Subscribe to updates of this plugin
   * @param {string} name name of the callback to register
   * @param {callback} cb The function to execute on update
   */
  subscribe(name, cb) {
    this._listeners[name] = cb
  }

  /**
   * Remove subscription
   * @param {string} name name of the callback to remove
   */
  unsubscribe(name) {
    delete this._listeners[name]
  }

  /**
   * Execute listeners
   */
  #emitUpdate() {
    for (const cb of this._listeners) {
      cb(this)
    }
  }

  /**
   * Check for updates and install if available.
   * @returns {Plugin} This plugin
   */
  async update() {
    const mnf = await manifest(this.origin)
    if (mnf.version !== this.version) {
      this.installOptions.version = false
      await this._install(false)
      this.#emitUpdate()
    }
    return this
  }

  /**
   * Mark plugin for removal. It will then be removed the next time the plugin is initialised (as by initPlugin in the main process).
   * @returns {Plugin} This plugin 
   */
  uninstall() {
    this._toUninstall = true
    this._active = false
    this.#emitUpdate()
    return this
  }

  /**
   * Set a plugin's active state. This determines if a plugin should be loaded on initialisation.
   * @param {boolean} active State to set _active to
   * @returns {Plugin} This plugin
   */
  setActive(active) {
    this._active = active
    this.#emitUpdate()
    return this
  }
}

export default Plugin
