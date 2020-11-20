const fs = require( "fs" ),
  path = require( "path" ),
  pacote = require( "pacote" )

const Package = require("./Package"),
  store = require( "./store" )

/** 
 * An NPM package that can be used as a Pluggable Electron plugin
 * @private
 * @extends Package
 * @property {string} path The folder where this plugin is located
 * @property {boolean} active Whether this plugin should be activated when its activation points are triggered
 * @property {boolean} uninstall Whether to uninstall this plugin the next time Pluggable Electron is initialised
 */
class Plugin extends Package {
  /**
   * Create and install a new plugin for the given psecifier
   * @param {string} spec The specifier used to locate the package (from NPM or local file)
   * @param {Object} [options] Optional options passed to pacote to fetch the manifest
   * @returns {Plugin} New plugin
   */
  static async install( spec, options ) {
    const plugin = new Plugin( spec, options )
    await plugin.download()

    // Add the plugin to store
    store.addPlugin( plugin )
    return plugin
  }

  /**
   * Create Plugin from an existing object
   * @param {{ origin: string,
   *           installOptions: Object,
   *           name: string,
   *           activationPoints: Array<string>,
   *           dependencies: Array.<{ package: string }>
   *        }} pkg Details of an already installed package
   * @returns {void}
   */
  static loadPkg( pkg ) {
    const plugin = new Plugin()

    // Populate plugin with pkg details
    for ( const key in pkg ) {
      plugin[key] = pkg[key]
    }

    // Add plugin to store or remove it
    if ( plugin.uninstall ) {
      fs.rmdirSync( plugin.path, { recursive: true } )
    } else {
      store.addPlugin( plugin, false )
    }
  }

  /**
   * Extract plugin to plugins folder and all dependencies in a node_modules folder
   * @returns {void}
   */
  async download() {
    try {
      // Install the plugin package in the plugins folder
      await this.installPkg( store.pluginsPath )

      if ( typeof this.activationPoints !== 'object' )
        throw new Error( 'The plugin does not contain any activation points' )

      this.path = path.join( store.pluginsPath, this.name)
    
      // Install all the plugin dependencies in the plugin's node_modules folder
      var modulesPath = path.join( this.path, 'node_modules' )
      fs.rmdirSync( modulesPath, { recursive: true } )
      this.installDeps( modulesPath )

    } catch ( err ) {
      // Ensure the plugin is not stored and the folder is removed if the installation fails
      if ( this.name ) fs.rmdirSync( path.join( store.pluginsPath, this.name), { recursive: true } )
      store.removePlugin( this.name )
      throw err
    }

  }

  /**
   * Check for updates and install if available
   * @returns {Plugin} This plugin
   */
  async update() {
    const manifest = await pacote.manifest( this.origin )
    if ( manifest.version !== this.version ) {
      this.installOptions.version = false
      await this.download()
      store.persistPlugins()
      return this
    }
  }
}

module.exports = Plugin
