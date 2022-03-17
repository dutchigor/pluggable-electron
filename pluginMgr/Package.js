import { manifest as _manifest, extract } from "pacote"
import { join } from "path"

/**
 * @private
 * An installable NPM package
 */
class Package {
  // See plugin for property definitions (to simplify documentation)
  origin
  installOptions
  name
  version
  activationPoints
  dependencies
  main

  /**
   * Set installOptions with defaults for options that have not been provided
   * @param {string} [origin] See {@link Plugin}
   * @param {Object} [options] See {@link Plugin}
   */
  constructor(origin, options) {
    this.origin = origin
    const defaultOpts = {
      version: false,
      fullMetadata: false
    }

    this.installOptions = { ...defaultOpts, ...options }
  }

  /**
   * @private
   * NPM friendly package name
   * @returns {string} Package name with version number
   */
  get specifier() {
    return this.origin + (this.installOptions.version ? '@' + this.installOptions.version : '')
  }

  /**
   * Set Package details based on it's manifest
   * @returns {Promise.<Boolean>} Resolves to true when the action completed 
   */
  async #getManifest() {
    // Get the package's manifest (package.json object)
    const manifest = await _manifest(this.specifier, this.installOptions)

    // If a valid manifest is found
    if (!manifest.name)
      throw new Error(`The package ${this.origin} does not contain a valid manifest`)

    // set the Package properties based on the it's manifest
    this.name = manifest.name
    this.version = manifest.version
    this.dependencies = manifest.dependencies || {}
    this.activationPoints = manifest.activationPoints || null
    this.main = manifest.main

    return true
  }

  /**
   * Extract the package to the provided folder
   * @param {string} installPath Path to folder to install package in
   * @returns {Promise.<boolean>} Resolves to true when the action completed
   * @private
   */
  async _installPkg(installPath) {

    // import the manifest details
    await this.#getManifest()

    // Install the package in a child folder of the given folder
    await extract(this.specifier, join(installPath, this.name), this.installOptions)

    return true
  }

  // /**
  //  * Install all packages specified as dependencies in modulesPath
  //  * @param {string} modulesPath Path to the node_modules folder to install the package in
  //  * @returns {Promise.<boolean>} Resolves to true when the action completed
  //  * @private
  //  */
  // async _installDeps(modulesPath) {
  //   // Set dependencies to empty if it doesn't exist
  //   const deps = (typeof this.dependencies === 'object') ?
  //     Object.entries(this.dependencies) : []

  //   // Install dependencies and all descendant dependencies
  //   for (const [name, version] of deps) {
  //     const childPkg = new Package(name, this.installOptions)
  //     childPkg.installOptions.version = version
  //     await childPkg._installPkg(modulesPath)
  //     await childPkg._installDeps(modulesPath)
  //   }
  //   return true
  // }
}

export default Package
