const em = require( "./extension-manager" ),
  am = require( "./activation-manager" ),
  mock = require( "mock-require" )

module.exports = epsName => {
  mock( epsName, em.getExtensionPoints() )
  return { ...em, triggerActivation: am.triggerActivation }
}
