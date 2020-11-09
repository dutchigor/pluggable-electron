const pacote = require( "pacote" )
const path = require( "path" )

// An installable NPM package
module.exports = class Package {
  origin
  installOptions
  name
  version
  extensionPoints
  dependencies

  // Set installOptions with defaults for options that have not been provided  
  constructor( origin, options ) {
    this.origin = origin
    const defaultOpts = {
      version: false,
      fullMetadata: false
    }

    this.installOptions = { ...defaultOpts, ...options }
  }

  // Use NPM friendly package name
  get specifier() {
    return this.origin + ( this.installOptions.version ? '@' + this.installOptions.version : '' )    
  }

  // Set Package details based on it's manifest
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

  // Extract the package to the provided folder
  async installPkg( installPath ) {

    // import the manifest details
    await this.getManifest()

    // Install the package in a child folder of the given folder
    await pacote.extract( this.specifier, path.join( installPath, this.name), this.installOptions )

    return this
  }

  async installDeps( modulesPath ) {
    // Default dependencies to empty if it doesn't exist
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