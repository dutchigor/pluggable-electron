const { ipcRenderer } = require( "electron" )

const Plugin = require( "./Plugin" )

module.exports.install = ( name, options ) => 
  ipcRenderer.invoke( 'pluggable:install', name, options )
    .then( plg => new Plugin( plg.name, plg.path, plg.activationPoints, plg.active) )

module.exports.uninstall = name => 
  ipcRenderer.invoke( 'pluggable:uninstall', name )

module.exports.getActivePlugins = () => 
  ipcRenderer.invoke( 'pluggable:getActivePlugins' )
    .then( this.getPluginList )

module.exports.update = name =>
  ipcRenderer.invoke( 'pluggable:update', name )
    .then( res => console.log( res ) )

// module.exports.initMain = installPath => {
//   ipcRenderer.invoke( 'pluggable:init', installPath )
//     .then( this.getPluginList )
// }

// Register plugin as active in the store if this is not already the case
module.exports.togglePluginActive = ( plugin, active ) => 
  ipcRenderer.invoke( 'pluggable:togglePluginActive', plugin.name, active )
    .then( res => console.log( 'togglePluginActive', res ) )

module.exports.getPluginList = plugins => plugins.map( plg =>
  new Plugin( plg.name, plg.path, plg.activationPoints, plg.active)
)
