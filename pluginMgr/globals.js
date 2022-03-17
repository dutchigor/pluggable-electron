import { existsSync, mkdirSync } from "fs"
import { normalize, join } from "path"

export let pluginsPath = null

/**
 * Set path to plugins directory and create the directory if it does not exist.
 * @param {string} plgPath path to plugins directory
 */
export function setPluginsPath(plgPath) {
  // Create folder if it does not exist
  let plgDir
  try {
    plgDir = normalize(plgPath)
    if (plgDir.length < 2) throw new Error()

  } catch (error) {
    throw new Error('Invalid path provided to the plugins folder')
  }

  if (!existsSync(plgDir)) mkdirSync(plgDir)
  pluginsPath = plgDir
}

// Get the path to the plugins.json file.
/**
 * Get the path to the plugins.json file.
 * @returns location of plugins.json
 */
export function getPluginsFile() { return join(pluginsPath, 'plugins.json') }
