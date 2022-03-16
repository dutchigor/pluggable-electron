export default Activation;
/**
 * A representation of a plugin's registration to an activation point
 * @private
 */
declare class Activation {
    /**
     * Create an activation
     * @param {string} plugin Name of the registered plugin.
     * @param {string} activationPoint Name of the activation point that is registered to.
     * @param {string} url location of the file containing the activation function.
     * @param {importer} importer Used to import the entry point.
     * @param {boolean} activated Whether the activation has been activated.
     * @returns {void}
     */
    constructor(plugin: string, activationPoint: string, url: string, importer: importer);
    plugin: string;
    activationPoint: string;
    url: string;
    importer: importer;
    activated: boolean;
    /**
     * Trigger the activation function in the plugin once,
     * providing the list of extension points or an object with the extension point's register, execute and executeSerial functions.
     * @param {boolean} presetEPs Whether the Extension Points have been predefined or can be created on the fly.
     * @returns {boolean} Whether the activation has already been activated.
     */
    trigger(presetEPs: boolean): boolean;
}
//# sourceMappingURL=Activation.d.ts.map