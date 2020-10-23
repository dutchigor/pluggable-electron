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
  this.removeActivePlugin( plugin )
  activePlugins.push( plugin )
  return activePlugins
}
module.exports.removeActivePlugin = name => {
  const index = activePlugins.findIndex( plugin => plugin.name === name )
  if (index > -1 ) activePlugins.splice(index, 1 )
  return activePlugins
}