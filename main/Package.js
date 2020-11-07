const pacote = require( "pacote" )
const path = require( "path" )

// An installable NPM package
module.exports = class Package {
  name
  version
  extensionPoints
  dependencies
  origin
  installOptions

  // Set installOptions with defaults for options that have not been provided  
  constructor( options ) {
    const defaultOpts = {
      version: false,
      fullMetadata: false
    }

    this.installOptions = { ...defaultOpts, ...options }
  }

  // Set Package details based on it's manifest
  async getManifest( spec ) {
    // Get the package's manifest (package.json object)
    const manifest = await pacote.manifest( spec, this.installOptions )

    // If a valid manifest is found
    if ( !manifest.name ) throw new Error( `The package ${spec} does not contain a valid manifest` )

    // set the Package properties based on the it's manifest
    this.name = manifest.name
    this.version = manifest.version
    this.origin = manifest._from
    this.dependencies = manifest.dependencies || {}
    this.extensionPoints = manifest.extensionPoints || null
  }

  // Extract the package to the provided folder
  async installPkg( spec, installPath ) {
    // Use NPM friendly package name
    const version = this.installOptions.version
    const pkg = spec + ( version ? '@' + version : '' )

    // import the manifest details
    await this.getManifest( spec )

    // Install the package in a child folder of the given folder
    await pacote.extract( pkg, path.join( installPath, this.name))
  }

  async installDeps( modulesPath ) {
    // Default dependencies to empty if it doesn't exist
    const deps = ( typeof this.dependencies === 'object' ) ?
      Object.entries( this.dependencies ) : []

    // Install dependencies and all descendant dependencies
    for ( const [ name, version ] of deps ) {
      const childPkg = new Package( this.installOptions )
      childPkg.installOptions.version = version
      await childPkg.installPkg( name, modulesPath )
      await childPkg.installDeps( modulesPath )
    }
  }
}