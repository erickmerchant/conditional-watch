const test = require('tape')
const mockery = require('mockery')
const mockerySettings = {
  useCleanCache: true,
  warnOnReplace: false,
  warnOnUnregistered: false
}

test('false', function (t) {
  t.plan(1)

  require('./index')(false, './foo', function () {
    t.ok(1)
  })
})

test('true', function (t) {
  mockery.enable(mockerySettings)

  t.plan(4)

  mockery.registerMock('debounce-fn', function (fn, options) {
    t.deepEqual(options, {wait: 150})

    return fn
  })

  mockery.registerMock('recursive-watch', function (directory, fn) {
    t.equal(directory, './foo')

    fn()
  })

  require('./index')(true, './foo', function () {
    t.ok(1)
  })

  mockery.disable()
})
