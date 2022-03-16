export default ExtensionPoint;
/**
 * Represents a point in the consumer's code that can be extended by a plugin.
 * The plugin can register a callback or object to the extension point.
 * When the extension point is triggered, the provided function will then be called or object will be returned.
 * @property {string} name Name of the extension point
*/
declare class ExtensionPoint {
    constructor(name: any);
    name: any;
    _extensions: any[];
    /**
     * Register new extension with this extension point.
     * The registered response will be executed (if callback) or returned (if object)
     * when the extension point is executed (see below).
     * @param {String} name Unique name for the extension.
     * @param {Object|Callback} response Object to be returned or function to be called by the extension point.
     * @param {Number} [priority] Order priority for execution used for executing in serial.
     * @returns {void}
     */
    register(name: string, response: Object | Callback, priority?: number | undefined): void;
    /**
     * Execute (if callback) and return or just return (if object) the response for each extension registered to this extension point.
     * Any asynchronous responses will be executed in parallel and the returned array will contain a promise for each of these responses.
     * @param {*} input Input to be provided as a parameter to each response if response is a callback.
     * @returns {Array} List of responses from the extensions.
     */
    execute(input: any): any[];
    /**
     * Execute (if callback) or return (if object) the response for each extension registered to this extension point in serial,
     * feeding the result from the last response as input to the next.
     * @param {*} input Input to be provided as a parameter to the 1st callback
     * @returns {Promise.<*>} Result of the last extension that was called
     */
    executeSerial(input: any): Promise<any>;
}
//# sourceMappingURL=ExtensionPoint.d.ts.map