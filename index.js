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
  exp.initPlugins = require( "./lib/main/init-plugins" )
  exp.useRenderer = require( "./lib/main/router" )
}

module.exports = exp
