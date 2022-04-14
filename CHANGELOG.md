## Version 0.4.1 ()
* Add get function to ExtensionPoint to get a specific extension registered with the extension point.
* Add clear function to ExtensionPoint to Empty the point's registry of all extensions.
* Add unregister function to ExtensionPoint to remove an extension from the point's registry.
* Add umd support back for the renderer (except for typescript as that should use the ES6 files).
### Features
* Added types. To make use of them in typescript, import pluggable-electron/renderer pluggable-electron /main or pluggable-electron/preload in the respective parts of your application.

## Version 0.4.0 (15/03/2022)
### Peer dependencies
* Bumped Electron to include version 17