import { mkdirSync, writeFileSync } from "original-fs"
import { init } from "."
import { join } from 'path'
import Plugin from "./Plugin"
import { existsSync, readFileSync, rmSync } from "fs"

const pluginsDir = './testPlugins'
const testPluginDir = './testPluginSrc'
const testPluginName = 'test-plugin'
const manifest = join(testPluginDir, 'package.json')
const main = 'index'

/** @type Plugin */
let plugin

beforeAll(() => {
  const pm = init({ confirmInstall: () => true }, pluginsDir)

  mkdirSync(testPluginDir)

  writeFileSync(manifest, JSON.stringify({
    name: testPluginName,
    activationPoints: {},
    main,
  }), 'utf8')

  plugin = new Plugin(testPluginDir)
})

afterAll(() => {
  rmSync(pluginsDir, { recursive: true })
  rmSync(testPluginDir, { recursive: true })
})


describe('subscribe', () => {
  let res = false
  it('should register the provided callback', () => {
    plugin.subscribe('test', () => res = true)
    plugin.setActive(true)

    expect(res).toBeTruthy()
  })
})

describe('unsubscribe', () => {
  it(`should remove the provided callback from the register
  after which it should not be executed anymore when the plugin is updated`, () => {
    let res = false
    plugin.subscribe('test', () => res = true)
    plugin.unsubscribe('test')
    plugin.setActive(true)

    expect(res).toBeFalsy()
  })
})

describe('install', () => {
  beforeAll(async () => {
    await plugin._install()
  })

  it('should store all the relevant manifest values on the plugin', async () => {
    expect(plugin).toMatchObject({
      origin: testPluginDir,
      installOptions: {
        version: false,
        fullMetadata: false,
      },
      name: testPluginName,
      url: `plugin://${testPluginName}/${main}`,
      activationPoints: {}
    })
  })

  it('should create a folder for the plugin if it does not yet exist and copy the plugin files to it', () => {
    expect(existsSync(manifest)).toBeTruthy()
  })

  it('should replace the existing plugin files in the plugin folder if it already exist', async () => {
    writeFileSync(manifest, JSON.stringify({
      name: testPluginName,
      activationPoints: {},
      main: 'updated',
    }), 'utf8')

    await plugin._install()

    const savedPkg = JSON.parse(readFileSync(join(pluginsDir, testPluginName, 'package.json')))

    expect(savedPkg.main).toBe('updated')
  })

  it('should throw an error and the plugin should be set to inactive if no manifest could be found', async () => {
    rmSync(join(testPluginDir, 'package.json'))

    await expect(() => plugin._install()).rejects.toThrow(/does not contain a valid manifest/)
  })

  it('should throw an error and the plugin should be set to inactive if plugin does not contain any activation points', async () => {
    writeFileSync(manifest, JSON.stringify({
      name: testPluginName,
      main,
    }), 'utf8')

    await expect(() => plugin._install()).rejects.toThrow('The plugin does not contain any activation points')
  })
})

describe('update', () => {
  let updatedPlugin
  let subscription = false

  beforeAll(async () => {
    writeFileSync(manifest, JSON.stringify({
      name: testPluginName,
      activationPoints: {},
      version: '0.0.1',
      main,
    }), 'utf8')

    await plugin._install()

    plugin.subscribe('test', () => subscription = true)

    updatedPlugin = await plugin.update()
  })

  it('should return the plugin object', () => {
    expect(updatedPlugin).toBeInstanceOf(Plugin)
  })

  it('should not do anything if no version update is available', () => {
    expect(updatedPlugin).toMatchObject({
      origin: testPluginDir,
      installOptions: {
        version: false,
        fullMetadata: false,
      },
      name: testPluginName,
      url: `plugin://${testPluginName}/${main}`,
      activationPoints: {}
    })
  })

  it('should update the plugin files to the latest version if there is a new version available for the plugin', async () => {
    writeFileSync(manifest, JSON.stringify({
      name: testPluginName,
      activationPoints: {},
      version: '0.0.2',
      main,
    }), 'utf8')

    await plugin.update()

    expect(updatedPlugin).toMatchObject({
      origin: testPluginDir,
      installOptions: {
        version: false,
        fullMetadata: false,
      },
      name: testPluginName,
      version: '0.0.2',
      url: `plugin://${testPluginName}/${main}`,
      activationPoints: {}
    })
  })

  it('should execute callbacks subscribed to this plugin, providing the plugin as a parameter', () => {
    expect(subscription).toBeTruthy()
  })
})

describe('setActive', () => {
  it('should set the plugin to be active', () => {
    plugin.setActive(true)
    expect(plugin._active).toBeTruthy()
  })

  it('should execute callbacks subscribed to this plugin, providing the plugin as a parameter', () => {
    let res = false
    plugin.subscribe('test', () => res = true)
    plugin.setActive(true)

    expect(res).toBeTruthy()
  })
})

describe('uninstall', () => {
  let subscription = false
  beforeAll(() => {
    plugin.subscribe('test', () => subscription = true)
    plugin.uninstall()
  })

  it('should mark the plugin as inactive and to be uninstalled', () => {
    expect(plugin).toMatchObject({
      _active: false,
      _toUninstall: true,
    })
  })

  it('should execute callbacks subscribed to this plugin, providing the plugin as a parameter', () => {
    expect(subscription).toBeTruthy()
  })
})
