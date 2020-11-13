const isRenderer = require( "is-electron-renderer" )

const exp = {}

if ( !isRenderer ) {
  exp.initPlugins = require( "./main/init-plugins" )
  exp.useRenderer = require( "./main/router" )
} else {
  exp.initEps = require( "./common/initEps" )
}

console.log( 'Process: ', process )

module.exports = exp
