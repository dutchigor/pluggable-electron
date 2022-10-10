jest.mock('electron', () => {
  const handlers = {}

  return {
    ipcMain: {
      handle: (channel, callback) => {
        handlers[channel] = callback
      }
    },
    ipcRenderer: {
      invoke: (channel, ...args) => {
        return Promise.resolve(handlers[channel].call(undefined, 'event', ...args))
      }
    }
  }
})

jest.mock('../pluginMgr/store', () => {
  const plugin = {
    name: 'mockPlugin',
    setActive: jest.fn(() => plugin),
    uninstall: jest.fn(),
    update: jest.fn(() => plugin),
  }

  return {
    getPlugin: jest.fn(() => plugin),
    getActivePlugins: jest.fn(() => []),
    installPlugin: jest.fn(() => plugin),
  }
})

const { rmSync } = require('fs')
const { getActive, install, uninstall, update, toggleActive } = require('./index')
const { setPluginsPath, setConfirmInstall } = require('../pluginMgr/globals')
const router = require('../pluginMgr/router')
const { getPlugin, getActivePlugins } = require('../pluginMgr/store')

const pluginsPath = './testPlugins'
const confirmInstall = jest.fn(() => true)

beforeAll(async () => {
  setPluginsPath(pluginsPath)
  router()
})

afterAll(() => {
  rmSync(pluginsPath, { recursive: true })
})

describe('install', () => {
  it('should return cancelled state if the confirmPlugin callback returns falsy', async () => {
    setConfirmInstall(() => false)
    const plugin = await install('test-install')
    expect(plugin).toEqual({ cancelled: true })
  })

  it('should make the confirmInstall callback available to the install handler if facade is used', async () => {
    setConfirmInstall(confirmInstall)
    await install('test-install')
    expect(confirmInstall.mock.calls.length).toBeTruthy()
    getPlugin().setActive.mockClear()
  })

  it('should return an active new plugin', async () => {
    setConfirmInstall(confirmInstall)
    await install('test-install')
    expect(getPlugin().setActive.mock.calls.length).toBeTruthy()
  })
})

describe('uninstall', () => {
  it('should call the uninstall function on the plugin with the provided name', async () => {
    await uninstall('test-uninstall')
    expect(getPlugin.mock.lastCall).toEqual(['test-uninstall'])
    const mockUninstall = getPlugin().uninstall
    expect(mockUninstall.mock.calls.length).toBeTruthy()
    mockUninstall.mockClear()
  })
})

describe('getActive', () => {
  it('should return all active plugins', async () => {
    await getActive()
    expect(getActivePlugins.mock.calls.length).toBeTruthy()
  })
})

describe('update', () => {
  it('should call the update function on the plugin with the provided name', async () => {
    await update('test-update')
    expect(getPlugin.mock.lastCall).toEqual(['test-update'])
    const mockUpdate = getPlugin().update
    expect(mockUpdate.mock.calls.length).toBeTruthy()
    mockUpdate.mockClear()
  })
})

describe('toggleActive', () => {
  it('call the setActive function on the plugin with the provided name, with the provided active state', async () => {
    await toggleActive('test-toggleActive', true)
    expect(getPlugin.mock.lastCall).toEqual(['test-toggleActive'])
    const mockSetActive = getPlugin().setActive
    expect(mockSetActive.mock.lastCall).toEqual([true])
    mockSetActive.mockClear()
  })
})
