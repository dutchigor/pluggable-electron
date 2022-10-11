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