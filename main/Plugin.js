const fs = require( "fs" ),
  path = require( "path" )

const Package = require("./Package"),
  store = require( "./store" )

// An NPM package that can be used as a Pluggable Electron plugin
module.exports = class Plugin extends Package {
  path
  active = false

  // Extract plugin to plugins folder and all dependencies in a node_modules folder
  async install ( spec ) {
    const pluginsPath = store.pluginsPath
    try {
      // Install the plugin package in the plugins folder
      await this.installPkg( spec, pluginsPath )
      if ( !this.extensionPoints ) throw new Error( 'The plugin does not contain any activation points' )
      this.path = path.join( pluginsPath, this.name)
    
      // Install all the plugin dependencies in the plugin's node_modules folder
      var modulesPath = path.join( this.path, 'node_modules' )
      fs.rmdirSync( modulesPath, { recursive: true } )
      this.installDeps( modulesPath )
  
      return this
  
    } catch ( err ) {
      // Remove entire plugin on failure of any package
      if ( this.name ) fs.rmdirSync( path.join( pluginsPath, this.name), { recursive: true } )
      throw err
    }
  }

  // Remove plugin folder from plugins folder
  uninstall() {
    fs.rmdirSync( this.path, { recursive: true } )
  }

  // Load Plugin details from an existing object
  loadPkg( pkg ) {
    for ( const key in pkg ) {
      this[key] = pkg[key]
    }
  }
}
