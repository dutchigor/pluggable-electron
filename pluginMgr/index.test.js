import { usePlugins, getStore, init } from './index'
import { installPlugin, getPlugin, getAllPlugins, getActivePlugins, addPlugin } from './store'
import Plugin from './Plugin'
import { existsSync, rmSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

// Set up variables for test folders and test plugins.
const pluginDir = './testPlugins'
const toRemovePluginName = 'pluginToRemove'
const toRemovePluginDir = join(pluginDir, toRemovePluginName)
const registeredPluginName = 'registered-plugin'
const demoPlugin = {
  origin: ".\\demo-plugin\\demo-plugin-1.5.0.tgz",
  installOptions: {
    version: false,
    fullMetadata: false
  },
  name: "demoPlugin",
  version: "1.5.0",
  activationPoints: [
    "init"
  ],
  main: "index.js",
  _active: true,
  _toUninstall: false,
  url: "plugin://demo-plugin/index.js"
}
const pluginToRemove = {
  origin: ".\\demo-plugin\\demo-plugin-1.5.0.tgz",
  installOptions: {
    version: false,
    fullMetadata: false
  },
  name: "pluginToRemove",
  version: "1.5.0",
  activationPoints: [
    "init"
  ],
  main: "index.js",
  _active: false,
  _toUninstall: true,
  url: "plugin://demo-plugin/index.js"
}


describe('before setting a plugin path', () => {
  describe('getStore', () => {
    it('should throw an error if called without a plugin path set', () => {
      expect(() => getStore()).toThrowError('The plugin path has not yet been set up. Please run usePlugins before accessing the store')
    })
  })

  describe('usePlugins', () => {
    it('should throw an error if called without a plugin path whilst no plugin path is set', () => {
      expect(() => usePlugins()).toThrowError('A path to the plugins folder is required to use Pluggable Electron')
    })

    it('should throw an error if called with an invalid plugin path', () => {
      expect(() => usePlugins('http://notsupported')).toThrowError('Invalid path provided to the plugins folder')
    })

    it('should create the plugin path if it does not yet exist', () => {
      // Execute usePlugins with a folder that does not exist
      const newPluginDir = './test-new-plugins'
      usePlugins(newPluginDir)
      expect(existsSync(newPluginDir)).toBe(true)

      // Remove created folder to clean up
      rmSync(newPluginDir, { recursive: true })
    })
  })
})

describe('after setting a plugin path', () => {
  let pm

  beforeAll(() => {
    // Create folders to contain plugins
    mkdirSync(pluginDir)
    mkdirSync(toRemovePluginDir)

    // Create initial 
    writeFileSync(join(pluginDir, 'plugins.json'), JSON.stringify({ pluginToRemove, demoPlugin }), 'utf8')

    // Register a plugin before using plugins
    const registeredPLugin = new Plugin(registeredPluginName)
    registeredPLugin.name = registeredPluginName
    addPlugin(registeredPLugin, false)

    // Load plugins
    pm = usePlugins(pluginDir)
  })

  afterAll(() => {
    rmSync(pluginDir, { recursive: true })
  })

  describe('getStore', () => {
    it('should return the plugin lifecycle functions if no plugin path is provided', () => {
      expect(getStore()).toEqual({
        installPlugin,
        getPlugin,
        getAllPlugins,
        getActivePlugins,
      })
    })
  })

  describe('usePlugins', () => {
    it('should return the plugin lifecycle functions if a plugin path is provided', () => {
      expect(pm).toEqual({
        installPlugin,
        getPlugin,
        getAllPlugins,
        getActivePlugins,
      })
    })

    it('should load the plugins defined in plugins.json in the provided plugins folder if a plugin path is provided', () => {
      expect(getPlugin('demoPlugin')).toEqual(demoPlugin)
    })

    it('should remove all and only the plugins marked to be uninstalled', () => {
      expect(() => getPlugin(toRemovePluginName)).toThrowError(`Plugin ${toRemovePluginName} does not exist`)
      expect(existsSync(toRemovePluginName)).toBe(false)
    })

    it('should unregister any registered plugins before registering the new ones if a plugin path is provided', () => {
      expect(() => getPlugin(registeredPluginName)).toThrowError(`Plugin ${registeredPluginName} does not exist`)
    })
  })
})

describe('init', () => {
  it.todo('should make the confirmInstall callback available to the install handler if facade is used')

  it.todo('should register the ipc handlers if facade is used')

  it.todo('should make the plugin files available through the plugin protocol')

  it.todo('should return the plugin lifecycle functions if a plugin path is provided')
})