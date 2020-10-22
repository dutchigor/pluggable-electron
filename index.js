const { app } = require('electron')

const router = require( "./lib/router" ),
  install = require( "./lib/install" ),
  store = require( "./lib/store"),
  uninstall = require( "./lib/uninstall" )

// set the initialisation defaults
const defaults = {
  path: app.getPath( 'appData' ),
  useRoutes: false
}

// Initialise listeners
module.exports.init = ( activePluggins = [], options ) => {

  // Provide defaults for unset options
  const opts = { ...defaults, ...options }

  if ( !store.getPluginsPath() ) {
    // If no path to plugin folder is set yet
    // initialise store and router
    store.setPluginsPath( opts.path )
    store.setActivePlugins( activePluggins )

    router.init( opts.useRoutes )
  } else {
    // Otherwise do not initialise
    console.warn( 'Pluggable Electron is already initialised' )
    return
  }
}

// update plugin folder
module.exports.updatePluginsPath = store.setPluginsPath

// Install plugin
module.exports.install = install

//uninstall plugin
module.exports.uninstall = uninstall
