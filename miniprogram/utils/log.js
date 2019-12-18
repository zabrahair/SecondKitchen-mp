const debug = function (object, message, tabs) {
  if (tabs == undefined) {
    tabs = 4
  }

  if (message == undefined) {
    message = 'object'
  }
  console.log(message + ':' + JSON.stringify(object, tabs))
}

module.exports = {
  debug: debug
}