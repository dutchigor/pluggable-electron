const pacote = require( "pacote" )
const path = require( "path" )

module.exports = class Package {
  specifier
  name
  manifest
  path
  installOptions
  constructor( specifier, options ) {
    this.specifier = specifier

    const defaultOpts = {
      version: false,
      fullMetadata: false
    }

    this.installOptions = { ...defaultOpts, ...options }
  }

  async installPkg( installPath ) {
    // Use NPM friendly package name
    const version = this.installOptions.version
    const pkg = this.specifier + ( version ? '@' + version : '' )

    // Get the package's manifest (package.json object)
    this.manifest = await pacote.manifest( pkg, this.installOptions )

    // If a valid manifest is found
    if ( !this.manifest.name ) throw new Error( `The package ${name} does not contain a valid manifest` )

    this.name = this.manifest.name

    // Install the package in a child folder of the given folder
    this.path = path.join( installPath, this.manifest.name)

    await pacote.extract( pkg, this.path)
  }

  async installDeps( modulesPath ) {
    // Default dependencies to empty if it doesn't exist
    const deps = ( typeof this.manifest.dependencies === 'object' ) ?
      Object.entries( this.manifest.dependencies ) : []

    // use reduce to install dependencies and return true on success or false on failure
    return await deps.reduce( async ( success, [ name, version ] ) => {
      const childPkg = new Package( name, this.installOptions )
      childPkg.installOptions.version = version
      await childPkg.installPkg( modulesPath )
      return await ( success && childPkg.installDeps( modulesPath ) )
    }, true)
  }
}