module.exports = epsName => {
  const isRenderer = require( "is-electron-renderer" )
  
  const extMan = require( "./extension-manager" ),
    actMan = require( "./activation-manager" )

  if ( epsName ) {    
    const mock = require( "mock-require" )
    mock( epsName, extMan.getExtensionPoints() )
  }  

  const exp = {}

  // Always export common functions
  exp.addExtensionPoint = extMan.addExtensionPoint
  exp.callExtensionPoint = extMan.callExtensionPoint
  exp.callSerialExtensionPoint = extMan.callSerialExtensionPoint
  exp.triggerActivation = actMan.triggerActivation

  // Export renderer functions
  if ( isRenderer ) {
    const ipcHandler = require( "../renderer/ipc-handler")

    exp.install = ipcHandler.install
    exp.uninstall = ipcHandler.uninstall
    exp.getActivePlugins = ipcHandler.getActivePlugins
    exp.update = ipcHandler.update
    exp.getPluginList = ipcHandler.getPluginList
  }

  return exp
}
