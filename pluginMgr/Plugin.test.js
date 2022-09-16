describe('subscribe', () => {
  it.todo('should register the provided callback')
})

describe('unsubscribe', () => {
  it.todo('should remove the provided callback from the register after which it should not be executed anymore when the plugin is updated')
})

describe('install', () => {
  it.todo('should store all the relevant manifest values on the plugin')

  it.todo('should throw an error and the plugin should be set to inactive if no manifest could be found')

  it.todo('should throw an error and the plugin should be set to inactive if plugin does not contain any activation points')

  it.todo('should create a folder for the plugin if it does not yet exist and copy the plugin files to it')

  it.todo('should replace the existing plugin files in the plugin folder if it already exist')
})

describe('update', () => {
  it.todo('should return the plugin object')

  it.todo('should update the plugin files to the latest version if there is a new version available for the plugin')

  it.todo('should not do anything if no version update is available')

  it.todo('should execute callbacks subscribed to this plugin, providing the plugin as a parameter')
})

describe('uninstall', () => {
  it.todo('should mark the plugin as inactive and to be uninstalled')

  it.todo('should execute callbacks subscribed to this plugin, providing the plugin as a parameter')
})

describe('setActive', () => {
  it.todo('should set the plugin to be active')

  it.todo('should execute callbacks subscribed to this plugin, providing the plugin as a parameter')
})