## Version 0.6.0
### Breaking changes!
* The parameters for the init function have moved to an options object to support further options in the future. See API specification.
* The installPlugin response from init has been renamed to installPlugins and expects an array of plugins as input.
* The confirmInstall function will now receive a list of specifiers as parameter to handle the installation of multiple plugins at once.
* The setup function in the renderer had been moved from the activationPoints object to the parent object to handle a build conflict.
* The facade functions are moved from preload to a plugins export in the renderer. The facade still needs to be registered during preload but should now just be called instead of exposed.
* The update and install methods on the facade now accept an array of plugin names and return an array of plugins. They also reload all renderers if reload is true, to remove any legacy extensions.

### Features
* Added the isUpdateAvailable method to the Plugin class.
* Added the triggerExport method on the Plugin class as returned by the facade functions. This allows for executing lifecycle functions on individual plugins, like on installation or update.
* Added registerActive method to facade to register all active plugins in the renderer.

## Version 0.5.1
* Update dependencies to latest versions for security fix.

## Version 0.5.0
### Breaking changes!
* Remove the ability to add custom extension points.
* Add onRegister and offRegister functions to Extension Point to listen to changes to extensions.

### Features
* Allow unregistering extensions from extension points using a regex for the name.
* Add function to unregister extensions from all extension points

## Version 0.4.3 (19/05/2022)
* Add clear function to Activation Points to clear the registry.
* Add remove function to Activation Points to remove a plugin from the registry.
* Add remove function to Extension Points to remove an extension point from the registry.

## Version 0.4.2 (14/04/2022)
### Features
* Add get function to ExtensionPoint to get a specific extension registered with the extension point.
* Add clear function to ExtensionPoint to Empty the point's registry of all extensions.
* Add unregister function to ExtensionPoint to remove an extension from the point's registry.
* Allow registration of custom extension points to utilise external framework benefits in extension points like reactivity.

## Bug fixes
* Add umd support back for the renderer (except for typescript as that should use the ES6 files).

### Breaking changes!
* extensionPoints.get() Always returns all extension points from now on because the filter was just confusing since it is an object.

### Peer dependencies
* Bumped Electron to include version 18

## Version 0.4.1 (11/04/2022)
### Features
* Added types. To make use of them in typescript, import pluggable-electron/renderer pluggable-electron /main or pluggable-electron/preload in the respective parts of your application.

## Version 0.4.0 (15/03/2022)
### Peer dependencies
* Bumped Electron to include version 17