const fs = require( "fs" )
const path = require( "path" )
const util = require("util");

const store = require( "./store" )
const removeDir = util.promisify(fs.rmdir);

// Uninstall plugin
module.exports = async ( plugin ) => {
  // Remove plugin from active list
  store.removeActivePlugin( plugin )

  // Remove plugin folder from plugins folder
  const pluginDir = path.join( store.getPluginsPath(), plugin )
  await removeDir( pluginDir, { recursive: true } )
  
  // return the updated list of actve plugins
  return store.getActivePlugins()
}