const watch = require('recursive-watch')

module.exports = function (conditional, targets, fn, options) {
  targets = [].concat(targets)

  if (conditional) {
    for (let target of targets) {
      watch(target, fn)
    }
  }

  return fn()
}
