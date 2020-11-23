const mock = require( "mock-require" )

const extensionPoints = require( "../common/extension-manager" ),
  activation = require( "../common/activation-manager" ),
  Plugin = require( "./Plugin" ),
  plugins = require( "./plugin-facade")

const exp = {
  extensionPoints,
  activation,
  Plugin,
  
  /**
   * Initialise the extension point registry mocking and/or enable the plugins object,
   * providing access to the main process plugin functions.
   * @global
   * @param {boolean} [usePluginFacade=true] Whether to enable to plugins object
   * @param {string} [mockName] Name of the module to mock the registry of extension point to
   * @returns {void}
   * @alias init
   */
  init( usePluginFacade = true, mockName ) {
    if ( mockName ) {    
      mock( mockName, exp.extensionPoints.get() )
    }
  
    if ( usePluginFacade ) this.plugins = plugins
  }

}

module.exports = exp
