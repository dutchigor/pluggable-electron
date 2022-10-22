import { get as getEPs, register, execute, executeSerial } from "./extension-manager.js"
/**
 * @private
 */

/**
 * Used to import a plugin entry point.
 * Ensure your bundler does no try to resolve this import as the plugins are not known at build time.
 * @callback importer
 * @param {string} entryPoint File to be imported.
 * @returns {module} The module containing the entry point function.
 */

/** @type {importer} */
export let importer

/**
 * Set the plugin importer function.
 * @param {importer} callback Callback to import plugins.
 */
export function setImporter(callback) {
  importer = callback
}

/** @type {Boolean|null} */
export let presetEPs

/**
 * Define how extension points are accessed.
 * @param {Boolean|null} peps Whether extension points are predefined.
 */
export function definePresetEps(peps) {
  presetEPs = (peps === null || peps === true) ? peps : false
}

/**
 * 
 * @param {string} url 
 * @param {string} exp 
 * @param {string} [plugin] 
 */
export async function callExport(url, exp, plugin) {
  if (!importer) throw new Error('Importer callback has not been set')

  const main = await importer(url)
  if (!main || typeof main[exp] !== 'function') {
    throw new Error(`Activation point "${exp}" was triggered but does not exist on ${plugin ? 'plugin ' + plugin : 'unknown plugin'}`)
  }
  const activate = main[exp]
  switch (presetEPs) {
    case true:
      activate(getEPs())
      break

    case null:
      activate()
      break

    default:
      activate({ register, execute, executeSerial })
      break;
  }
}