const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()

test('false - returned value', function (t) {
  t.plan(2)

  let symbol = Symbol('testing')

  t.equal(symbol, require('./index')(false, './foo', function () {
    t.ok(1)

    return symbol
  }))
})

test('true - watching', function (t) {
  t.plan(3)

  proxyquire('./index', {
    'recursive-watch': function (directory, fn) {
      t.equal(directory, './foo')

      fn('a-file')
    }
  })(true, './foo', function (files) {
    t.ok(1)
  })
})

test('true - multiple', function (t) {
  t.plan(2)

  let directories = []

  proxyquire('./index', {
    'recursive-watch': function (directory, fn) {
      directories.push(directory)
    }
  })(true, ['./foo', './bar'], function (files) {
    t.ok(1)

    t.deepEqual(directories, ['./foo', './bar'])
  })
})
