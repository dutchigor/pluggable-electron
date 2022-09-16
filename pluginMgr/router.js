import { ipcMain } from "electron"

import { getPlugin, getActivePlugins, installPlugin } from "./store"
import { pluginsPath, confirmInstall } from './globals'

// Throw an error if pluginsPath has not yet been provided by usePlugins.
const checkPluginsPath = () => {
  if (!pluginsPath) throw Error('Path to plugins folder has not yet been set up.')
}
let active = false
/**
 * Provide the renderer process access to the plugins.
 **/
export default function () {
  if (active) return
  // Register IPC route to install a plugin
  ipcMain.handle('pluggable:install', async (e, plg, options, activate = true) => {
    checkPluginsPath()
    const conf = await confirmInstall(plg)
    if (!conf) return { cancelled: true }
    const plugin = await installPlugin(plg, options)
    plugin.setActive(activate)
    return JSON.parse(JSON.stringify(plugin))
  })

  // Register IPC route to uninstall a plugin
  ipcMain.handle('pluggable:uninstall', (e, plg) => {
    checkPluginsPath()
    const plugin = getPlugin(plg)
    plugin.uninstall()
    return true
  })

  // Register IPC route to update a plugin
  ipcMain.handle('pluggable:update', (e, plg) => {
    checkPluginsPath()
    const plugin = getPlugin(plg)
    return JSON.parse(JSON.stringify(plugin.update()))
  })

  // Register IPC route to get the list of active plugins
  ipcMain.handle('pluggable:getActivePlugins', () => {
    checkPluginsPath()
    return JSON.parse(JSON.stringify(getActivePlugins()))
  })

  // Register IPC route to toggle the active state of a plugin
  ipcMain.handle('pluggable:togglePluginActive', (e, plg, active) => {
    checkPluginsPath()
    const plugin = getPlugin(plg)
    return JSON.parse(JSON.stringify(plugin.setActive(active)))
  })

  active = true
}
