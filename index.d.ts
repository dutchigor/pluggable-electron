import { extensionPoints, activationPoints } from './execution/index.js'
import { install, uninstall, getActive, toggleActive, update, plugin } from './facade/index.js'
import { init, usePlugins } from './pluginMgr/index.js'

export {
  extensionPoints,
  activationPoints,
  install,
  uninstall,
  getActive,
  toggleActive,
  update,
  plugin,
  init,
  usePlugins
}