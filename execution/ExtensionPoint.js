/**
 * Represents a point in the consumer's code that can be extended by a plugin.
 * An object containing all extension points should be required by a plugin when the activation function is triggered.
 * The plugin can use this to register a callback or object to the extension point.
 * When the extension point is triggered, the provided function will then be called or object will be returned.
 * @property {string} name Name of the extension point
*/
export default class ExtensionPoint {
  _extensions

  constructor(name) {
    this.name = name
    this._extensions = []
  }

  /**
   * Register new extension with this extension point.
   * The registered response will be executed (for callback) or returned (for object) 
   * when the extension point is executed (see below).
   * @param {string} name Unique name for the extension
   * @param {Object|Callback} response Object to be returned or function to be called by the extension point.
   * @param {number} priority Order priority for execution used for executing in serial.
   * @returns {void}
   */
  register(name, response, priority = 0) {
    const index = this._extensions.findIndex(p => p.priority > priority)
    const newExt = { name, response, priority }
    if (index > -1) {
      this._extensions.splice(index, 0, newExt)
    } else {
      this._extensions.push(newExt)
    }
  }

  /**
   * Execute (if callback) and return or just return (if object) the response for each extension registered to this extension point.
   * @param {*} input Input to be provided as a parameter to each callback
   * @param {boolean} exitOnError Whether to move to the next extension or stop if an error is encountered
   * @returns {Promise.<Array>} Result of Promise.all or Promise.allSettled depending on exitOnError
   */
  execute(input, exitOnError = true) {
    const fn = exitOnError ? 'all' : 'allSettled'
    return Promise[fn](this._extensions.map(p => {
      if (typeof p.response === 'function') {
        return p.response(input)
      } else {
        return p.response
      }
    }))
  }

  /**
   * Execute (if callback) or return (if object) the response for each extension registered to this extension point in serial,
   * feeding the result from the last response as input to the next.
   * @param {*} input Input to be provided as a parameter to the 1st callback
   * @returns {Promise.<*>} Result of the last extension that was called
   */

  async executeSerial(input) {
    return await this._extensions.reduce(async (throughput, p) => {
      let tp = await throughput
      if (typeof p.response === 'function') {
        tp = await p.response(tp)
      } else if (Array.isArray(tp)) {
        tp.push(p.response)
      }
      return tp
    }, input)
  }
}
