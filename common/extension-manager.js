const ExtensionPoint = require("./ExtensionPoint")

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
