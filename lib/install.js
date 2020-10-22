const pacote = require( "pacote" )
const path = require( "path" )
const store = require( "./store" )

// Validate package details and return name
async function installPkg( installPath, name, version ) {
  // Use NPM friendly package name
  const pkg = name + ( version ? '@' + version : '' )

  // Get the package's manifest (package.json object)
  const manifest = await pacote.manifest( pkg, { fullMetadata: false } )

  // If a valid manifest is found
  if ( !manifest.name ) return false

  // Install the package in a child folder of the given folder
  const pkgPath = path.join( installPath, manifest.name)

  await pacote.extract( pkg, pkgPath)

  // return the package dependencies as an array and the installation path
  const pkgDeps = ( typeof manifest.dependencies === 'object' ) ?
    Object.entries( manifest.dependencies ) : []

  return { 
    dependencies: pkgDeps,
    name: manifest.name
  }
}

// Provide install method
module.exports = async ( pkgName, pkgVersion ) => {
  // Install a package and all it's dependencies
  async function installDeps ( deps ) {

    // use reduce to install dependencies and return true on success or false on failure
    return await deps.reduce( async ( success, [ name, version ] ) => {
      const childPkg = await installPkg( modulesPath, name , version)
      return success && installDeps( childPkg.dependencies )
    }, true)
  }

  // Install the plugin package in the plugins folder
  const pluginsPath = store.getPluginsPath()
  const pkg = await installPkg( pluginsPath, pkgName, pkgVersion )

  // Install all the plugin dependencies in the plugin's node_modules folder
  let modulesPath
  if ( pkg ) {
    modulesPath = path.join( pluginsPath, pkg.name, 'node_modules' )
    return installDeps( pkg.dependencies ) ?
      // Return the list of active pluggins, including the isntalled one if successful
      store.addActivePluggin( pkg.name ) :
      store.getActivePlugins()
  }
}
