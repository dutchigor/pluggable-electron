const fs = require( "fs" )
const path = require( "path" )
const util = require("util");

const store = require( "./store" )
const removeDir = util.promisify(fs.rmdir);

// Uninstall plugin
module.exports = async ( plugin ) => {
  let activePlugins
  let success

  try {
    // Remove plugin from active list
    store.removeActivePlugin( plugin )

    // Remove plugin folder from plugins folder
    const pluginDir = path.join( store.getPluginsPath(), plugin )
    await removeDir( pluginDir, { recursive: true } )
    
    // return the updated list of actve plugins
    success = true
  } catch (error) {
    console.error( error )
    success = false
  } finally {
    activePlugins = store.getActivePlugins()
    return { success, activePlugins }
  }
}