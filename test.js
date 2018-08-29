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
  t.plan(4)

  proxyquire('./index', {
    'debounce-fn': function (fn, options) {
      t.deepEqual(options, { wait: 150 })

      return fn
    },
    'recursive-watch': function (directory, fn) {
      t.equal(directory, './foo')

      fn('a-file')
    }
  })(true, './foo', function (files) {
    t.ok(1)
  })
})

test('true - debounced', function (t) {
  t.plan(2)

  proxyquire('./index', {
    'recursive-watch': function (directory, fn) {
      t.equal(directory, './foo')

      fn('a-file')

      fn('b-file')
    }
  })(true, './foo', function (files) {
    if (files) {
      t.deepEqual(files, ['a-file', 'b-file'])
    }
  })
})

test('true - multiple', function (t) {
  t.plan(2)

  let directories = []

  proxyquire('./index', {
    'debounce-fn': function (fn, options) {
      return fn
    },
    'recursive-watch': function (directory, fn) {
      directories.push(directory)
    }
  })(true, ['./foo', './bar'], function (files) {
    t.ok(1)

    t.deepEqual(directories, ['./foo', './bar'])
  })
})
