const fs = require("fs"),
  { protocol } = require('electron')
const path = require("path")

const Plugin = require("./Plugin"),
  store = require("./store"),
  router = require("./router")

/**
 * Sets up the required communication between the main and renderer processes.
 * Additionally sets the plugins up using {@link setupPlugins} if a pluginsPath is provided.
 * @param {boolean} [useRendererFacade=true] Whether to make a facade to the plugins available in the renderer.
 * @param {string} [pluginsPath] Optional path to the plugins folder.
 * @returns {Promise.<Array.<Plugin>>} A list of active plugins.
 * @function
 */
exports.init = (useRendererFacade = true, pluginsPath) => {
  // Enable IPC to be used by the renderer facade if this option is enabled
  if (useRendererFacade) router()

  // Create plugins protocol to serve plugins to renderer
  registerPluginProtocol()

  // perform full setup if pluginsPath is provided
  if (pluginsPath) {
    return this.setupPlugins(pluginsPath)
  }

  return []

}

/**
 * @private
 * Create plugins protocol to serve plugins to renderer
 * @returns {boolean} Whether the protocol registration was successful
 */
const registerPluginProtocol = () => {
  return protocol.registerFileProtocol('plugin', (request, callback) => {
    const entry = request.url.substr(8)
    const url = path.normalize(store.pluginsPath + entry)
    callback({ path: url })
  })
}

/**
 * Set Pluggable Electron up to run from the pluginPath folder and
 * load plugins persisted in that folder
 * @param {string} [pluginsPath=<appData>/plugins] Optional path to the plugins folder
 * @returns {Promise.<Array.<Plugin>>} A list of active plugins
 */
exports.setupPlugins = (pluginsPath) => {
  // Store the path to the plugins folder
  store.setPluginsPath(pluginsPath)

  // Remove any registered plugins
  for (const plugin of store.getAllPlugins()) {
    store.removePlugin(plugin.name, false)
  }

  // Read plugin list from plugins folder
  if (fs.existsSync(store.getPluginsFile())) {
    const plugins = JSON.parse(fs.readFileSync(store.getPluginsFile()))
    try {
      // Create a Plugin instance for each plugin in list
      for (const p in plugins) {
        loadPlugin(plugins[p])
      }
      store.persistPlugins()

    } catch (error) {
      // Throw meaningful error if plugin loading fails
      throw new Error('Could not successfully rebuild list of installed plugins. Please check the plugins.json file in the plugins folder')
    }

    // Return a list of all plugins to be activated in the client
  }
  return store.getActivePlugins()
}

/**
 * @private
 * Check the give plugin object. If it is marked for uninstalling, the plugin files are removed.
 * Otherwise a Plugin instance for the provided object is created and added to the store.
 * @param {Object} plg Simple plugin
 */
const loadPlugin = (plg) => {
  if (plg._toUninstall) {
    // Remove plugin if it is set to be uninstalled
    const plgPath = path.resolve(store.pluginsPath, plg.name)
    fs.rmdirSync(plgPath, { recursive: true })

  } else {
    // Create new plugin, populate it with plg details and save it to the store
    const plugin = new Plugin()

    for (const key in plg) {
      plugin[key] = plg[key]
    }

    store.addPlugin(plugin, false)
  }
}

/**
 * Create and install a new plugin for the given specifier
 * @param {string} spec The specifier used to locate the package (from NPM or local file)
 * @param {Object} [options] Optional options passed to pacote to fetch the manifest
 * @returns {Plugin} New plugin
 */
exports.installPlugin = async (spec, options) => {
  const plugin = new Plugin(spec, options)
  return await plugin._install()
}

/**
 * Provides access to the plugins stored by Pluggable Electron
 * @namespace register
 */
exports.register = {
  getPlugin: store.getPlugin,
  getAllPlugins: store.getAllPlugins,
  getActivePlugins: store.getActivePlugins,
}