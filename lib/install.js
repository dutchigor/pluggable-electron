const pacote = require( "pacote" )
const path = require( "path" )
const fs = require( "fs" )
const store = require( "./store" )

// Validate package details and return name
async function installPkg( installPath, name, version ) {
  // Use NPM friendly package name
  const pkg = name + ( version ? '@' + version : '' )

  // Get the package's manifest (package.json object)
  const manifest = await pacote.manifest( pkg, { fullMetadata: false } )

  // If a valid manifest is found
  if ( !manifest.name ) throw new Error( `The package ${name} does not contain a valid manifest` )

  // Install the package in a child folder of the given folder
  const pkgPath = path.join( installPath, manifest.name)

  await pacote.extract( pkg, pkgPath)

  // return the package dependencies as an array and the installation path
  const pkgDeps = ( typeof manifest.dependencies === 'object' ) ?
    Object.entries( manifest.dependencies ) : []

  return { 
    dependencies: pkgDeps,
    name: manifest.name,
    activationPoints: manifest.activationPoints
  }
}

// Provide install method
module.exports = async ( pkgName, options ) => {
  // Install a package and all it's dependencies
  async function installDeps ( deps ) {

    // use reduce to install dependencies and return true on success or false on failure
    return await deps.reduce( async ( success, [ name, version ] ) => {
      const childPkg = await installPkg( modulesPath, name , version)
      return success && installDeps( childPkg.dependencies )
    }, true)
  }

  const pluginsPath = store.getPluginsPath()
  let success
  let plugins

  const defaultOpts = {
    version: false
  }

  try {
    // if ( !pkgName ) throw new Error( 'No package provided' )
    const opts = { ...defaultOpts, ...options }

    // Install the plugin package in the plugins folder    
    var pkg = await installPkg( pluginsPath, pkgName, opts.version )
    if ( !pkg.activationPoints ) throw new Error( 'The plugin does not contain any activation points' )
  
    // Install all the plugin dependencies in the plugin's node_modules folder
    var modulesPath = path.join( pluginsPath, pkg.name, 'node_modules' )
    fs.rmdirSync( modulesPath, { recursive: true } )
    installDeps( pkg.dependencies )

    // Return the list of active pluggins, including the isntalled one if successful
    delete pkg.dependencies
    success = true
    plugins = store.addActivePluggin( pkg )

  } catch ( err ) {
    console.error( err )
    if ( pkg ) fs.rmdirSync( path.join( pluginsPath, pkg.name), { recursive: true } )
    success = false
    plugins = store.getActivePlugins()
  } finally {
    return { success, plugins }
  }
}
