const { ipcMain } = require( "electron" )
const install = require( "./install" )
const uninstall = require( "./uninstall" )

// Register install IPC route
const routeInstall = () => {
  ipcMain.handle( 'pluggable:install', ( e, package, version ) =>
    install( package, version )
  )
}

// Register uninstall IPC route
const routeUninstall = () => {
  ipcMain.handle( 'pluggable:uninstall', ( e, package ) =>
    uninstall( package )
  )
}

// store of all available routes
const allRoutes = {
  install: routeInstall,
  uninstall: routeUninstall
}

// intitialise module
module.exports.init = function ( routes ) {
  // if routes is true, enable all routes
  if ( routes === true ) {
    for ( fn of Object.values( allRoutes ) ) {
      fn()
    }
  } 
  // If routes is an array, enable all routes included in array
  else if ( Array.isArray( routes ) ) {
    for ( route of routes ) {
      if ( allRoutes.hasOwnProperty( route ) ) allRoutes[route]()
    }
  }
}
