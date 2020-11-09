const { app } = require( "electron" ),
  fs = require( "fs" ),
  path = require( "path" )

// Path to the plugins folder
module.exports.pluginsPath = path.join( app.getPath( 'appData' ), 'plugins' )

// List of installed plugins
const plugins = {}

// Get list of plugin objects by name
module.exports.getPlugins = ( names ) => names.reduce( ( res, name ) => {
  if ( typeof plugins[name] === 'object' )
    res.push( plugins[name] )
  return res
}, [] )


module.exports.getPlugin = ( name ) => {
  if ( typeof plugins[name] !== 'object' ) {
    throw new Error( `Plugin ${name} does not exist` )
  }

  return plugins[name]
}

// Get list of all plugin objects
module.exports.getAllPlugins = () => Object.values( plugins )

// Get list of active plugin objects
module.exports.getActivePlugins = () =>
Object.values( plugins ).filter( plugin => plugin.active )

// Remove plugin from store and maybe save stored plugins to file
module.exports.removePlugin = ( name, persist = true ) => {
  delete plugins[name]
  if ( persist ) this.persistPlugins()
}

// Add plugin to store and maybe save stored plugins to file
module.exports.addPlugin = ( package, persist = true ) => {
  plugins[package.name] = package
  if ( persist ) this.persistPlugins()
}

// Save stored plugins to file
module.exports.persistPlugins = () => {
  const filename = path.join( this.pluginsPath, 'plugins.json' )
  return fs.writeFileSync( filename, JSON.stringify( plugins ), 'utf8' )
}
