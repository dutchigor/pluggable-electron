const { app } = require( "electron" ),
  fs = require( "fs" ),
  path = require( "path" )

// Path to the plugins folder
module.exports.pluginsPath = null

const plugins = {}

module.exports.getPlugins = ( names ) => names.map( name => plugins[name] )

module.exports.getAllPlugins = () => Object.values( plugins )

module.exports.getActivePlugins = () =>
Object.values( plugins ).filter( plugin => plugin.active )

module.exports.removePlugin = ( name, persist = true ) => {
  delete plugins[name]
  if ( persist ) persistPlugins()
}

module.exports.addPlugin = ( package, persist = true ) => {
  plugins[package.name] = package
  if ( persist ) persistPlugins()
}

module.exports.togglePluginActive = ( plugin, active, persist = true ) => {
  plugins[plugin].active = active
  if ( persist ) persistPlugins()
}

const persistPlugins = () => {
  const filename = path.join( this.pluginsPath, 'plugins.json' )
  return fs.writeFileSync( filename, JSON.stringify( plugins ), 'utf8' )
}

// set the initialisation defaults
module.exports.getDefaults = () => {
  return {
    path: app.getPath( 'appData' ),
    useRoutes: false
  }
}