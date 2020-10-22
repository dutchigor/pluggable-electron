const { ipcMain } = require( "electron" )
const install = require( "./install" )

module.exports.init = ( pe ) => {
  ipcMain.handle( 'pluggable:install', ( e, package, version ) =>
    install( package, version )
    // { return { package, version} }
  )
}