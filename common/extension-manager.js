const ExtensionPoint = require("./ExtensionPoint"),
  PluginList = require( "./PluginList" )

const extensionPoints = {}

module.exports.addExtensionPoint = name =>{
  extensionPoints[name] = new ExtensionPoint( name )
}

module.exports.getExtensionPoints = eps => {
  if ( !eps ) return extensionPoints
  eps.reduce( ( res, name ) => {
    if ( typeof extensionPoints[name] === 'object' )
      res.push( extensionPoints[name] )
    return res
  }, [] )
}

module.exports.callExtensionPoint = ( name, input ) => {
  if ( typeof extensionPoints[name] !== 'object' )
    throw new Error( `No extension point found with name ${name}` )

  return extensionPoints[name].execute( input )
}

module.exports.callSerialExtensionPoint = ( name, input ) => {
  if ( typeof extensionPoints[name] !== 'object' )
    throw new Error( `No extension point found with name ${name}` )

  return extensionPoints[name].executeSerial( input )
}

module.exports.initMain = installPath => {
  ipc.invoke( 'pluggable:init', installPath )
    .then( plugins => new PluginList( plugins ) )
}

module.exports.install = ( name, options ) => 
  ipc.invoke( 'pluggable:install', name, options )
    .then( plugin => new PluginList( [ plugin ] ) )

module.exports.uninstall = name => 
  ipc.invoke( 'pluggable:uninstall', name )

module.exports.getActivePlugins = () => 
  ipc.invoke( 'pluggable:getActivePlugins' )
    .then( plugins => new PluginList( plugins ) )

module.exports.update = name =>
  ipc.invoke( 'pluggable:update', name )
    .then( res => console.log( res ) )

module.exports.getPluginList = ( plugins ) => new PluginList( plugins )