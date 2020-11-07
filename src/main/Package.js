const pacote = require( "pacote" )
const path = require( "path" )

module.exports = class Package {
  name
  version
  extensionPoints
  dependencies
  origin
  installOptions
  constructor( options ) {

    const defaultOpts = {
      version: false,
      fullMetadata: false
    }

    this.installOptions = { ...defaultOpts, ...options }
  }

  async getManifest( spec ) {
    // Get the package's manifest (package.json object)
    const manifest = await pacote.manifest( spec, this.installOptions )

    // If a valid manifest is found
    if ( !manifest.name ) throw new Error( `The package ${spec} does not contain a valid manifest` )

    this.name = manifest.name
    this.version = manifest.version
    this.origin = manifest._from
    this.dependencies = manifest.dependencies || {}
    this.extensionPoints = manifest.extensionPoints || null
  }

  async installPkg( spec, installPath ) {
    // Use NPM friendly package name
    const version = this.installOptions.version
    const pkg = spec + ( version ? '@' + version : '' )

    await this.getManifest( spec )

    // Install the package in a child folder of the given folder
    await pacote.extract( pkg, path.join( installPath, this.name))
  }

  async installDeps( modulesPath ) {
    // Default dependencies to empty if it doesn't exist
    const deps = ( typeof this.dependencies === 'object' ) ?
      Object.entries( this.dependencies ) : []

    // use reduce to install dependencies and return true on success or false on failure
    return await deps.reduce( async ( success, [ name, version ] ) => {
      const childPkg = new Package( this.installOptions )
      childPkg.installOptions.version = version
      await childPkg.installPkg( name, modulesPath )
      return await ( success && childPkg.installDeps( modulesPath ) )
    }, true)
  }
}