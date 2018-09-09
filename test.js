const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()

test('false - returned value', (t) => {
  t.plan(2)

  let symbol = Symbol('testing')

  t.equal(symbol, require('./index')(false, './foo', () => {
    t.ok(1)

    return symbol
  }))
})

test('true - watching', (t) => {
  t.plan(3)

  proxyquire('./index', {
    'recursive-watch' (directory, fn) {
      t.equal(directory, './foo')

      fn('a-file')
    }
  })(true, './foo', (files) => {
    t.ok(1)
  })
})

test('true - multiple', (t) => {
  t.plan(2)

  let directories = []

  proxyquire('./index', {
    'recursive-watch' (directory, fn) {
      directories.push(directory)
    }
  })(true, ['./foo', './bar'], (files) => {
    t.ok(1)

    t.deepEqual(directories, ['./foo', './bar'])
  })
})
