exports.commandNames = ["rw"];

exports.parseCommand = function(text) {
  var match = new RegExp("^rw (.+)").exec(text);

  if (match === null) {
    return false;
  } else {
    return [this, match[1]];
  }
};

exports.run = function(json) {
  if (typeof(json) != "string") {
    json = JSON.stringify(json);
  }

  var connection = this.callingModule.Commands.connection,
      log        = this.callingModule.Helpers.log,
      verbose    = this.callingModule.verbose;

  var data       = json + "\n",
      header     = "Content-Length: " + data.length + "\r\n\r\n",
      message    = header + data;

  if (verbose) {
    log(message, "verbose: >>> ");
  }

  connection.write(message);
};
