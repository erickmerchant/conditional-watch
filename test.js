const test = require('tape')
const mockery = require('mockery')
const mockerySettings = {
  useCleanCache: true,
  warnOnReplace: false,
  warnOnUnregistered: false
}

test('false - returned value', function (t) {
  t.plan(2)

  let symbol = Symbol('testing')

  t.equal(symbol, require('./index')(false, './foo', function () {
    t.ok(1)

    return symbol
  }))
})

test('true - watching', function (t) {
  mockery.enable(mockerySettings)

  t.plan(4)

  mockery.registerMock('debounce-fn', function (fn, options) {
    t.deepEqual(options, {wait: 150})

    return fn
  })

  mockery.registerMock('recursive-watch', function (directory, fn) {
    t.equal(directory, './foo')

    fn('a-file')
  })

  require('./index')(true, './foo', function (files) {
    t.ok(1)
  })

  mockery.disable()

  mockery.deregisterAll()
})

test('true - debounced', function (t) {
  mockery.enable(mockerySettings)

  t.plan(2)

  mockery.registerMock('recursive-watch', function (directory, fn) {
    t.equal(directory, './foo')

    fn('a-file')

    fn('b-file')
  })

  require('./index')(true, './foo', function (files) {
    if (files) {
      t.deepEqual(files, ['a-file', 'b-file'])
    }
  })

  mockery.disable()

  mockery.deregisterAll()
})

test('true - multiple', function (t) {
  mockery.enable(mockerySettings)

  t.plan(2)

  let directories = []

  mockery.registerMock('debounce-fn', function (fn, options) {
    return fn
  })

  mockery.registerMock('recursive-watch', function (directory, fn) {
    directories.push(directory)
  })

  require('./index')(true, ['./foo', './bar'], function (files) {
    t.ok(1)

    t.deepEqual(directories, ['./foo', './bar'])
  })

  mockery.disable()

  mockery.deregisterAll()
})
