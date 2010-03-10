exports.run = function(json) {
  if (typeof(json) != "string") {
    json = JSON.stringify(json);
  }

  var connection = this.calling_module.Commands.connection,
      log        = this.calling_module.Helpers.log,
      verbose    = this.calling_module.verbose;

  var data       = json + "\n",
      header     = "Content-Length: " + data.length + "\r\n\r\n",
      message    = header + data;

  if (verbose) {
    log(message, "verbose: >>> ");
  }

  connection.write(message);
};

exports.parse = function(text) {
  var match = new RegExp("^rw (.+)").exec(text);

  if (match === null) {
    return false;
  } else {
    return [this, match[1]];
  }
};