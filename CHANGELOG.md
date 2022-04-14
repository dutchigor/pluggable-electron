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