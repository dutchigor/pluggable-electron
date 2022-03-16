export = Package;
/**
 * @private
 * An installable NPM package
 */
declare class Package {
    /**
     * Set installOptions with defaults for options that have not been provided
     * @param {string} [origin] See {@link Plugin}
     * @param {Object} [options] See {@link Plugin}
     */
    constructor(origin?: string | undefined, options?: Object | undefined);
    origin: string | undefined;
    installOptions: {
        constructor?: Function | undefined;
        toString?: (() => string) | undefined;
        toLocaleString?: (() => string) | undefined;
        valueOf?: (() => Object) | undefined;
        hasOwnProperty?: ((v: PropertyKey) => boolean) | undefined;
        isPrototypeOf?: ((v: Object) => boolean) | undefined;
        propertyIsEnumerable?: ((v: PropertyKey) => boolean) | undefined;
        version: boolean;
        fullMetadata: boolean;
    };
    name: any;
    version: any;
    activationPoints: any;
    dependencies: any;
    main: any;
    /**
     * @private
     * NPM friendly package name
     * @returns {string} Package name with version number
     */
    private get specifier();
    /**
     * Extract the package to the provided folder
     * @param {string} installPath Path to folder to install package in
     * @returns {Promise.<boolean>} Resolves to true when the action completed
     * @private
     */
    private _installPkg;
    #private;
}
//# sourceMappingURL=Package.d.ts.map