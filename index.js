const watch = require('recursive-watch')
const debounce = require('debounce-fn')

module.exports = function (conditional, directory, fn, options) {
  if (conditional) {
    let files = []
    let debounced = debounce(function () {
      fn(files)

      files = []
    }, options || {wait: 150})

    watch(directory, function (file) {
      files.push(file)

      debounced()
    })
  }

  fn()
}
