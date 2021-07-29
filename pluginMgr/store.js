/**
 * Provides access to the plugins stored by Pluggable Electron
 * @namespace pluginManager
 */

const fs = require("fs"),
  path = require("path") //,
// { app } = require("electron")

/**
 * @private
 * @constant {string} pluginsPath Path to the plugins folder.
 **/
module.exports.pluginsPath = null

/**
 * @private
 * Set pluginsPath and create the directory if it does not exist.
 * @param {String} plgPath Path to the plugins folder.
 */
module.exports.setPluginsPath = plgPath => {
  // Create folder if it does not exist
  let plgDir
  try {
    plgDir = path.normalize(plgPath)
    if (plgDir.length < 2) throw new Error()

  } catch (error) {
    throw new Error('Invalid path provided to the plugins folder')
  }

  if (!fs.existsSync(plgDir)) fs.mkdirSync(plgDir)
  this.pluginsPath = plgDir
}

/**
 * @private
 * Get the path to the plugins.json file.
 */
module.exports.getPluginsFile = () => path.join(this.pluginsPath, 'plugins.json')

// Register of installed plugins
const plugins = {}

/**
 * Get a plugin from the stored plugins.
 * @param {string} name Name of the plugin to retrieve
 * @returns {Plugin} Retrieved plugin
 * @alias pluginManager.getPlugin
 */
module.exports.getPlugin = (name) => {
  if (!plugins.hasOwnProperty(name)) {
    throw new Error(`Plugin ${name} does not exist`)
  }

  return plugins[name]
}

/**
 * Get list of all plugin objects.
 * @returns {Array.<Plugin>} All plugin objects
 * @alias pluginManager.getAllPlugins
 */
module.exports.getAllPlugins = () => Object.values(plugins)

/**
 * Get list of active plugin objects.
 * @returns {Array.<Plugin>} Active plugin objects
 * @alias pluginManager.getActivePlugins
 */
module.exports.getActivePlugins = () =>
  Object.values(plugins).filter(plugin => plugin._active)

/**
 * @private
 * Remove plugin from store and maybe save stored plugins to file
 * @param {string} name Name of the plugin to remove
 * @param {boolean} persist Whether to save the changes to plugins to file
 * @returns {boolean} Whether the delete was successful
 */
module.exports.removePlugin = (name, persist = true) => {
  const del = delete plugins[name]
  if (persist) this.persistPlugins()
  return del
}

/**
 * @private
 * Add plugin to store and maybe save stored plugins to file
 * @param {Plugin} plugin Plugin to add to store
 * @param {boolean} persist Whether to save the changes to plugins to file
 * @returns {void}
 */
module.exports.addPlugin = (plugin, persist = true) => {
  plugins[plugin.name] = plugin
  if (persist) this.persistPlugins()
}

/**
 * @private
 * Save stored plugins to file
 * @returns {void}
 */
module.exports.persistPlugins = () => {
  fs.writeFileSync(this.getPluginsFile(), JSON.stringify(plugins), 'utf8')
}

/**
 * Create and install a new plugin for the given specifier.
 * @param {String} spec The specifier used to locate the package (from NPM or local file)
 * @param {Object} [options] Optional options passed to {@link https://www.npmjs.com/package/pacote|pacote} to fetch the manifest
 * @returns {Plugin} New plugin
 * @alias pluginManager.installPlugin
 */
module.exports.installPlugin = async (spec, options) => {
  const plugin = new Plugin(spec, options)
  return await plugin._install()
}


/**
 * This function is executed when a plugin is installed to verify that the user indeed wants to install the plugin.
 * @callback confirmInstall
 * @param {string} plg The specifier used to locate the package (from NPM or local file)
 * @returns {boolean} Whether to proceed with the plugin installation
 */
module.exports.confirmInstall = plg => new Error(
  'The facade.confirmInstall callback needs to be set in when initializing Pluggable Electron in the main process.'
)
