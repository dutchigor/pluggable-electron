import Ep from './ExtensionPoint'

/** @type {Ep} */
let ep

beforeEach(() => {
  ep = new Ep('test-ep')
})


it('should create a new extension point by providing a name', () => {
  expect(ep).toEqual({ name: 'test-ep', _extensions: [] })
})

it('should register extension with extension point', () => {
  ep.register('test-ext', { foo: 'bar' }, 10)
  expect(ep._extensions).toEqual([{
    name: 'test-ext',
    response: { foo: 'bar' },
    priority: 10
  }])
})

it('should register extension with a default priority of 0 if not provided', () => {
  ep.register('test-ext', { foo: 'bar' })
  expect(ep._extensions).toEqual([{
    name: 'test-ext',
    response: { foo: 'bar' },
    priority: 0
  }])
})