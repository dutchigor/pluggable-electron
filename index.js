const isRenderer = require( "is-electron-renderer" )

const exp = {}

if ( isRenderer ) {
  exp.extensionPoints = require( "./lib/common/extension-manager" )
  exp.activation = require( "./lib/common/activation-manager" )
  exp.plugins = require( "./lib/renderer/plugin-facade")

  const mock = require( "mock-require" )
  exp.initEps = epsName => {
    if ( epsName ) {    
      mock( epsName, exp.extensionPoints.get() )
    } 
  }
} else {
  const init = require( "./lib/main/init" )
  const useRenderer = require( "./lib/main/router" )
  const store = require( "./lib/main/store" )
  
  exp.loadPlugins = init.loadPlugins
  exp.installPlugin = init.installPlugin
  exp.useRenderer = useRenderer
  exp.register = {
    getPlugin: store.getPlugin,
    getAllPlugins: store.getAllPlugins,
    getActivePlugins: store.getActivePlugins
  }
}

module.exports = exp
