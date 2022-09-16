describe('usePlugins', () => {
  it.todo('should return the plugin lifecycle functions if no plugin path is provided')

  it.todo('should throw an error if called without a plugin path whilst no plugin path is set')

  it.todo('should return the plugin lifecycle functions if a plugin path is provided')

  it.todo('should create the plugin path if it does not yet exist')

  it.todo('should unregister any registered plugins before registering the new ones if a plugin path is provided')

  it.todo('should load the plugins defined in plugins.json in the provided plugins folder if a plugin path is provided')

  it.todo('should remove all and only the plugins marked to be uninstalled')

  it.todo('should throw an error if called with an invalid plugin path')
})

describe('init', () => {
  it.todo('should make the confirmInstall callback available to the install handler if facade is used')

  it.todo('should register the ipc handlers if facade is used')

  it.todo('should make the plugin files available through the plugin protocol')

  it.todo('should return the plugin lifecycle functions if a plugin path is provided')
})