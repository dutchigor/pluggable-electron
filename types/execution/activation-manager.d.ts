/**
 * Set the renderer options for Pluggable Electron. Should be called before any other Pluggable Electron function in the renderer
 * @param {Object} options
 * @param {activation~importer} options.importer The callback function used to import the plugin entry points.
 * @param {Boolean} [options.presetEPs=false] Whether the Extension Points have been predefined or can be created on the fly.
 * @returns {void}
 * @alias activationPoints.setup
 */
export function setup(options: Object): void;
/**
 * Register a plugin with its activation points (as defined in its manifest).
 * @param {plugin} plugin plugin object as provided by the main process.
 * @returns {void}
 * @alias activationPoints.register
 */
export function register(plugin: any): void;
/**
 * Trigger all activations registered to the given activation point. See {@link Plugin}.
 * This will call the function with the same name as the activation point on the path specified in the plugin.
 * @param {string} activationPoint Name of the activation to trigger
 * @returns {Promise.<Boolean>} Resolves to true when the activations are complete.
 * @alias activationPoints.trigger
 */
export function trigger(activationPoint: string): Promise<boolean>;
/**
 * ~importer
 */
export type activation = (entryPoint: string) => any;
//# sourceMappingURL=activation-manager.d.ts.map