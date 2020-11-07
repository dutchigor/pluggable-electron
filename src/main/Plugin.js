const fs = require( "fs" ),
  path = require( "path" )

const Package = require("./Package"),
  store = require( "./store" )

module.exports = class Plugin extends Package {
  path
  active = false
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
      if ( this.name ) fs.rmdirSync( path.join( pluginsPath, this.name), { recursive: true } )
      throw err
    }
  }

  uninstall() {
    // Remove plugin folder from plugins folder
    fs.rmdirSync( this.path, { recursive: true } )
  }

  loadFromFile( pkg ) {
    for ( const key in pkg ) {
      this[key] = pkg[key]
    }
  }

  async loadPkg( plgPath ) {
    // Get manifest from where the plugin is installed
    await this.getManifest( plgPath )

    this.path = plgPath
  }
}