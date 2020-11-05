const fs = require( "fs" ),
  { app } = require('electron')

  const plugins = []

module.exports.getPlugin = ( name ) =>
  plugins.find( plugin => plugin.name === name )

module.exports.removePlugin = ( name ) => {
  const index = plugins.findIndex( package => package.name === name )
  if (index > -1 ) plugins.splice(index, 1 )
  return plugins
}

module.exports.addPlugin = ( package ) => {
  this.removePlugin( package.name )
  plugins.push( package )
  return plugins
}

// Path to the plugins folder
let pluginsPath = null

module.exports.setPluginsPath = ( path ) => {
  pluginsPath = path
}

module.exports.getPluginsPath = () => pluginsPath

// set the initialisation defaults
module.exports.getDefaults = () => {
  return {
    path: app.getPath( 'appData' ),
    useRoutes: false
  }
}