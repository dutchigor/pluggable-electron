const fs = require("fs"),
  { protocol } = require('electron'),
  path = require("path")

const Plugin = require("./Plugin"),
  store = require("./store"),
  router = require("./router")

/**
 * Sets up the required communication between the main and renderer processes.
 * Additionally sets the plugins up using {@link setupPlugins} if a pluginsPath is provided.
 * @param {Object} facade configuration for setting up the renderer facade.
 * @param {confirmInstall} facade.confirmInstall Function to validate that a plugin should be installed. 
 * @param {Boolean} [facade.use=true] Whether to make a facade to the plugins available in the renderer.
 * @param {string} [pluginsPath] Optional path to the plugins folder.
 * @returns {Promise.<Array.<Plugin>>} A list of active plugins.
 * @function
 */
exports.init = (facade, pluginsPath) => {
  if (!facade.hasOwnProperty('use') || facade.use) {
    // Store the confirmInstall function
    store.confirmInstall = facade.confirmInstall
    // Enable IPC to be used by the facade
    router()
  }

  // Create plugins protocol to serve plugins to renderer
  registerPluginProtocol()

  // perform full setup if pluginsPath is provided
  if (pluginsPath) {
    return this.usePlugins(pluginsPath)
  }

  return {}

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
 * @param {string} [pluginsPath] Path to the plugins folder. Required if not yet set up.
 * @returns {Promise.<Array.<Plugin>>} A list of active plugins
 */
exports.usePlugins = (pluginsPath) => {
  if (!pluginsPath && !store.pluginsPath) throw Error('A path to the plugins folder is required to use Pluggable Electron')
  if (pluginsPath) {
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
    }

    // Return the plugin lifecycle functions
  }
  return {
    installPlugin,
    getPlugin: store.getPlugin,
    getAllPlugins: store.getAllPlugins,
    getActivePlugins: store.getActivePlugins,

  }
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
 * @alias pluginManager.installPlugin
 */
const installPlugin = async (spec, options) => {
  const plugin = new Plugin(spec, options)
  return await plugin._install()
}
