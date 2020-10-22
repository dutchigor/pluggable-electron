let pluginsPath

module.exports.setPluginsPath = path => pluginsPath = path
module.exports.getPluginsPath = () => pluginsPath || false

let activePlugins = []

module.exports.setActivePlugins = plugins => activePlugins = plugins
module.exports.getActivePlugins = () => activePlugins
module.exports.addActivePluggin = plugin => {
  activePlugins.push( plugin )
  return activePlugins
}
