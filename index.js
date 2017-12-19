const watch = require('recursive-watch')
const debounce = require('debounce-fn')

module.exports = function (conditional, directory, fn, options) {
  if (conditional) {
    watch(directory, debounce(function () {
      fn()
    }, options || {wait: 150}))
  }

  return fn()
}
