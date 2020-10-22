// Path to the plugins folder
let pluginsPath

// getter and setter
module.exports.setPluginsPath = path => pluginsPath = path
module.exports.getPluginsPath = () => pluginsPath || false

// List of plugins who's extension points have been registered
let activePlugins = []

// getter, setter and array update handlers
module.exports.setActivePlugins = plugins => activePlugins = plugins
module.exports.getActivePlugins = () => activePlugins
module.exports.addActivePluggin = plugin => {
  activePlugins.push( plugin )
  return activePlugins
}
module.exports.removeActivePlugin = plugin => {
  activePlugins.splice( activePlugins.indexOf( plugin ), 1 )
  return activePlugins
}