# Pluggable Electron
<!-- PROJECT SHIELDS: See https://github.com/badges/shields -->

<!-- PROJECT LOGO -->

<!-- TABLE OF CONTENTS -->
<!-- TOC depthfrom:2 depthto:3 -->

* [What is Pluggable Electron](#what-is-pluggable-electron)
* [Introduction](#introduction)
  * [❗Notice❗](#notice)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
  * [Extension points](#extension-points)
  * [Registering extensions](#registering-extensions)
  * [Creating plugins](#creating-plugins)
  * [Installing plugins](#installing-plugins)
  * [End result](#end-result)
  * [Further functionality](#further-functionality)
* [Demo](#demo)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [Release Notes](#release-notes)
* [License](#license)
* [Contact](#contact)

<!-- /TOC -->
## What is Pluggable Electron
**Pluggable Electron is a framework to build Electron apps that can be extended by other parties.** 

## Introduction

Pluggable Electron allows an [Electron](https://www.electronjs.org/) app to include extension points in the code. Plugin developers can then write extensions - in the form of npm packages - that can be inserted into these extension points.

The framework includes the tools necessary to manage the whole life cycle of plugins, for example writing, installing, uninstalling and updating plugins, and creating and triggering extension points.

The framework uses [inversion of control](https://en.wikipedia.org/wiki/Inversion_of_control) and [dependency inversion](https://en.wikipedia.org/wiki/Dependency_inversion_principle) principles for this.

![Framework process](https://github.com/dutchigor/pluggable-electron/wiki/images/Pluggable-Electron-design.svg)

### ❗Notice❗
As of version 0.6.0 the largest development effort seems to be done. I will try to keep the interface as steady as possible from now on but as always, changes can happen.

Version 0.6.0 has however included quite a number of breaking changes to ensure all the necessary interfaces and features are now included. For people migrating from an earlier version, please see the [release notes](./CHANGELOG.md) for how to update your code.

## Getting Started

To include Pluggable Electron, follow these simple steps:

### Prerequisites

This package should be installed inside an Electron project. Please [create that first](https://www.electronjs.org/docs/tutorial/quick-start).

### Installation

Add Pluggable Electron in your project as a dependency to your project
```sh
npm install pluggable-electron
```

## Usage

Below you will find a quick start guide on how to set Pluggable Electron up. A full guide can be found in the [wiki](github.com/dutchigor/pluggable-electron/wiki)

The framework is built around the concepts of Extension points and Plugins

### Extension points
Extension points are added to your [renderer](https://www.electronjs.org/docs/tutorial/quick-start#application-architecture) code.

Execute extension point where you want to provide plugin developers with the possibility to extend your code. This can be done as a handover, parallel execution, or serial execution. These options are explained [here](https://github.com/dutchigor/pluggable-electron/wiki#defining-and-triggering-extension-points).
```javascript
// renderer/your-module.js
import { extensionPoints } from "pluggable-electron/renderer"

// ... Your business logic ...
const extendMenu = extensionPoints.execute('purchase_menu', purchaseMenu )
// extendMenu will contain the result of any extensions registered to purchase_menu
```

### Registering extensions
To determine the extensions that need to be executed by an extension point, it needs to be possible for plugins to register to an extension. This is done by creating activation points which are the points where plugins are activated. On activation, a plugin can register functions or objects to extension points (see below). Creating an activation point requires the activation point manager to be set up.

There can be different strategies for activating the plugin, like:
* Activating all plugins during startup - one point during the app startup for synchronous extensions and one after startup for async extensions
* Activating the relevant plugins just before an extension point is triggered.

See the API for the activation point manager [here](https://github.com/dutchigor/pluggable-electron/wiki/Execution-API#activation).


```js
// renderer/index.js
import { setup, activationPoints } from "pluggable-electron/renderer"

// Enable the activation points
setup({
  // Provide the import function
  importer: async (pluginPath) => import( /* webpackIgnore: true */ pluginPath)
})

// insert at any point
activationPoints.trigger( 'init' )
// but before related extension points are triggered.
```

### Creating plugins
A plugin is an npm package with activation points added to the package.json.
```json
// package.json
{
   ...
   "main": "index.js",
   "activationPoints": [
      "init"
   ]
   ...
}
```

The main file of this plugin should include a function for each of the activation points listed in the package.json. This function will be be triggered by the activation point and be passed an object containing a function to register extensions to extension points by default. An extension can be a callback or object returned to the register method.
```javascript
// index.js
export function init (extensionPoints) {
   // Mock function for adding a menu item
   const yourCustomExtension = (varFromExtensionPoint) => {
      // your extension code here.
      // varFromExtensionPoint is provided as a parameter when the extension point is executed;
      // purchaseMenu in the example above.
   }

  // Register to purchase_menu extension point
  extensionPoints.register( 'purchase_menu', 'extension-name', yourCustomExtension )
}
```

### Installing plugins
Plugins are managed in the main process but can be installed from the renderer or the main process. In this setup we will use the renderer. This requires the initialisation of the plugin facade in the renderer using a [preload script](https://www.electronjs.org/docs/latest/tutorial/process-model/#preload-scripts). Doing everything from the main process is described in the [API documentation](https://github.com/dutchigor/pluggable-electron/wiki/main-API).

Once installed, the plugins should be loaded on every startup.

```js
// main.js
const pe = require( "pluggable-electron/main" )
...
app.whenReady().then(() => {
  //Initialise pluggable Electron
  pe.init({
      // Function to check from the main process that user wants to install a plugin for security
      confirmInstall: async plugins => {
        const answer = await dialog.showMessageBox({
          message: `Are you sure you want to install the plugins ${plugins.join(', ')}`,
          buttons: ['Ok', 'Cancel'],
          cancelId: 1,
        })
        return answer.response == 0
      },
      // Folder to save the plugins to
      pluginsPath: path.join(app.getPath('userData'), 'plugins')
    })
  ...
})
```

```js
// preload.js
const useFacade = require("pluggable-electron/preload")
useFacade()
```

```js
// renderer/your-install-module.js
import { plugins } from 'pluggable-electron/renderer'

// Get plugin file from input and install
document.getElementById( 'install-file-input' ).addEventListener( 'change', (e) =>
   plugins.install( [e.target.files[0].path] )
)
```

```js
//  renderer/index.js
import { setup, plugins, activationPoints } from "pluggable-electron/renderer"

// Enable the activation points
setup({
  importer: async (pluginPath) => import( /* webpackIgnore: true */ pluginPath)
})

// Get plugins that have been installed previously
// and register them with their activation points
plugins.registerActive()

// insert at any point after the plugins have been registered
activationPoints.trigger( 'init' )
```

### End result
Now the `yourCustomExtension` function in the plugin will be executed when the execution point `purchase_menu` is triggered.

### Further functionality
Pluggable Electron provides a host of functions to support the full plugin lifecycle and some alternative workflows. A more detailed description of the full lifecycle, as well as a detailed API documentation can be found in the [wiki](https://github.com/dutchigor/pluggable-electron/wiki).

## Demo

A demo project using Pluggable Electron can be found here: https://github.com/dutchigor/pluggable-electron-demo. Also check out the with-vue branch to see an example with Vite and Vue. This example contains a few catches to be aware of when using packaged frontend framework so I recommend checking this out for any such framework.

## Roadmap

See the [open issues](https://github.com/dutchigor/pluggable-electron/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open-source community such an amazing place to be, learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Release Notes

See [Changelog](./CHANGELOG.md)

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

This project is maintained by Igor Honhoff. Feel free to contact me at igor@flarehub.io
Project Link: [https://github.com/dutchigor/pluggable-electron](https://github.com/dutchigor/pluggable-electron)

<!-- ACKNOWLEDGEMENTS -->
