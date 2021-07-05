const fs = require("fs"),
  path = require("path"),
  pacote = require("pacote")

const Package = require("./Package"),
  store = require("./store")

/** 
 * An NPM package that can be used as a Pluggable Electron plugin
 * @extends Package
 * @property {string} origin Original specification provided to fetch the package.
 * @property {Object} installOptions Options provided to pacote when fetching the manifest.
 * @property {name} The name of the plugin as defined in the manifest.
 * @property {string} url Electron URL where the package can be accessed.
 * @property {string} version Version of the package as defined in the manifest.
 * @property {Array<string>} activationPoints List of activation points. @see Activation .
 * @property {Array<{ package: string }>} dependencies A list of dependencies as defined in the manifest.
 * @property {string} main The entry point as defined in the main entry of the manifest
 */
class Plugin extends Package {
  _active = false
  _toUninstall = false

  /**
   * Extract plugin to plugins folder and all dependencies in a node_modules folder
   * @param {boolean} addToStore Whether to add the installed plugin to the store 
   * @returns {Promise.<Plugin>} This plugin
   * @private
   */
  async _install(addToStore = true) {
    try {
      // Install the plugin package in the plugins folder
      await this._installPkg(store.pluginsPath)

      if (typeof this.activationPoints !== 'object')
        throw new Error('The plugin does not contain any activation points')

      // Set the url using the custom plugins protocol
      this.url = `plugin://${this.name}/${this.main}`

      // Install all the plugin dependencies in the plugin's node_modules folder
      var modulesPath = path.join(this.name, 'node_modules')
      fs.rmdirSync(modulesPath, { recursive: true })
      await this._installDeps(modulesPath)

      if (addToStore) store.addPlugin(this)

    } catch (err) {
      // Ensure the plugin is not stored and the folder is removed if the installation fails
      this._active = false
      throw err
    }

    return this
  }

  /**
   * Check for updates and install if available
   * @returns {Plugin} This plugin
   */
  async update() {
    const manifest = await pacote.manifest(this.origin)
    if (manifest.version !== this.version) {
      this.installOptions.version = false
      await this._install(false)
      store.persistPlugins()
      return this
    }
  }

  /**
   * Mark plugin for removal. It will then be removed the next time the plugin is initialised (as by initPlugin in the main process).
   * @returns {Plugin} This plugin 
   */
  uninstall() {
    this._toUninstall = true
    this._active = false
    store.persistPlugins()
    return this
  }

  /**
   * Set a plugin's active state. This determines if a plugin should be loaded on initialisation.
   * @param {boolean} active State to set _active to
   * @returns {Plugin} This plugin
   */
  setActive(active) {
    this._active = active
    store.persistPlugins()
    return this
  }
}

module.exports = Plugin
