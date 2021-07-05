/**
 * This object contains a register of extension points and the means to work with it
 * @namespace extensionPoints
 */

import ExtensionPoint from "./ExtensionPoint.js"

/** 
 * @constant {Object.<string, ExtensionPoint>} extensionPoints
 * @private
 * Register of extension points created by the consumer
 */
const extensionPoints = {}

/**
 * Create new extension point and add it to the registry.
 * @param {string} name Name of the extension point
 * @returns {void}
 * @alias extensionPoints.add
 */
export function add(name) {
  extensionPoints[name] = new ExtensionPoint(name)
}

/**
 * Fetch extension points by name, or all if no names are provided.
 * @param {Array.<string>} eps List of names of extension points to fetch
 * @returns {Array.<ExtensionPoint>} Found extension points
 * @alias extensionPoints.get
 */
export function get(eps) {
  if (!eps) return extensionPoints
  eps.reduce((res, name) => {
    if (typeof extensionPoints[name] === 'object')
      res.push(extensionPoints[name])
    return res
  }, [])
}

/**
 * Call all the extensions registered to the extension point in parallel. See execute on {@link ExtensionPoint}.
 * Call this at the point in the base code where you want it to be extended.
 * @param {string} name Name of the extension point to call
 * @param {*} input Parameter to provide to the extensions if they are a function
 * @param {boolean} exitOnError Whether to move to the next extension or stop if an error is encountered
 * @returns {Promise.<Array>} Result of Promise.all or Promise.allSettled depending on exitOnError
 * @alias extensionPoints.execute
 */
export function execute(name, input, exitOnError) {
  if (typeof extensionPoints[name] !== 'object')
    throw new Error(`No extension point found with name ${name}`)

  return extensionPoints[name].execute(input, exitOnError)
}

/**
 * Calls all the extensions registered to the extension point in serial. See executeSerial on {@link ExtensionPoint}
 * Call this at the point in the base code where you want it to be extended.
 * @param {string} name Name of the extension point to call
 * @param {*} input Parameter to provide to the extensions if they are a function
 * @returns {Promise.<*>} Result of the last extension that was called
 * @alias extensionPoints.executeSerial
 */
export function executeSerial(name, input) {
  if (typeof extensionPoints[name] !== 'object')
    throw new Error(`No extension point found with name ${name}`)

  return extensionPoints[name].executeSerial(input)
}
