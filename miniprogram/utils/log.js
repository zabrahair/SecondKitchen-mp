const debug = function (message, object,  tabs) {
  if (tabs == undefined) {
    tabs = 4
  }

  if (message == undefined) {
    message = 'object'
  }
  console.log(message + ':' + JSON.stringify(object, {}, tabs))
}

const error = function (message, object, tabs) {
  if (tabs == undefined) {
    tabs = 4
  }

  if (message == undefined) {
    message = 'object'
  }
  console.error(message + ':' + JSON.stringify(object, {}, tabs))
}

module.exports = {
  debug: debug,
  error: error,
}