const watch = require('recursive-watch')
const debounce = require('debounce-fn')

module.exports = function (conditional, targets, fn, options) {
  targets = [].concat(targets)

  if (conditional) {
    let files = []
    let debounced = debounce(function () {
      fn(files)

      files = []
    }, options || { wait: 150 })

    for (let target of targets) {
      watch(target, function (file) {
        files.push(file)

        debounced()
      })
    }
  }

  return fn()
}
