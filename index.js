const { app } = require('electron')

const router = require( "./lib/router" )
const install = require( "./lib/install" )
const store = require( "./lib/store")

// Get the path to appData
const appData = app.getPath( 'desktop' )

// Initialise listeners
module.exports.init = ( path = appData, activePluggins = [] ) => {

  if ( !store.getPluginsPath() ) {
    store.setPluginsPath( path )
    store.setActivePlugins( activePluggins )
  } else {
    console.warn( 'Pluggable Electron is already initialised' )
    return
  }

  router.init()
}

module.exports.updatePluginsPath = store.setPluginsPath

module.exports.install = install
