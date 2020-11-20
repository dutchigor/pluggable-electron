const pacote = require( "pacote" )
const path = require( "path" )

/**
 * An installable NPM package
 * @private
 * @property {string} origin Original specification provided to fecth the package
 * @property {Object} installOptions Options provided to pacote when fetching the manifest
 * @property {string} name Name of the package 
 * @property {string} version Version of the package as defined in the manifest 
 * @property {Array<string>} activationPoints List of activation points. @see Activation 
 * @property {Array<{ package: string }>} dependencies A list of dependencies as defined in the manifest
 */
class Package {
  /**
   * Set installOptions with defaults for options that have not been provided
   * @param {string} [origin] @see origin
   * @param {Object} [options] @see installOptions
   */
  constructor( origin, options ) {
    this.origin = origin
    const defaultOpts = {
      version: false,
      fullMetadata: false
    }

    this.installOptions = { ...defaultOpts, ...options }
  }

  /**
   * Use NPM friendly package name
   * @returns {string} Package name with version number
   */
  get specifier() {
    return this.origin + ( this.installOptions.version ? '@' + this.installOptions.version : '' )    
  }

  /**
   * Set Package details based on it's manifest
   * @returns {Package} This package
   */
  async getManifest() {
    // Get the package's manifest (package.json object)
    const manifest = await pacote.manifest( this.specifier, this.installOptions )

    // If a valid manifest is found
    if ( !manifest.name )
      throw new Error( `The package ${this.origin} does not contain a valid manifest` )

    // set the Package properties based on the it's manifest
    this.name = manifest.name
    this.version = manifest.version
    this.dependencies = manifest.dependencies || {}
    this.activationPoints = manifest.activationPoints || null

    return this
  }

  /**
   * Extract the package to the provided folder
   * @param {string} installPath Path to folder to install package in
   * @returns {Package} This package
   */
  async installPkg( installPath ) {

    // import the manifest details
    await this.getManifest()

    // Install the package in a child folder of the given folder
    await pacote.extract( this.specifier, path.join( installPath, this.name), this.installOptions )

    return this
  }

  /**
   * Install all packages specified as dependencies in modulesPath
   * @param {string} modulesPath Path to the node_modules folder to install the package in
   * @returns {Package} This package
   */
  async installDeps( modulesPath ) {
    // Set dependencies to empty if it doesn't exist
    const deps = ( typeof this.dependencies === 'object' ) ?
      Object.entries( this.dependencies ) : []

    // Install dependencies and all descendant dependencies
    for ( const [ name, version ] of deps ) {
      const childPkg = new Package( name, this.installOptions )
      childPkg.installOptions.version = version
      await childPkg.installPkg( modulesPath )
      await childPkg.installDeps( modulesPath )
    }
    return this
  }
}

module.exports = Package
