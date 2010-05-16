exports.commandNames = ["bt", "backtrace"];

exports.parseCommand = function(text) {
  return this.callingModule.Helpers.commonParse.call(this, text);
};

exports.run = function() {
  var ndb = this.callingModule,
      rw  = ndb.Commands.RawWrite;

  rw.run({
    type:    "request",
    command: "backtrace"
  });
};

exports.output = function(json) {
  var ndb    = this.callingModule,
      puts   = ndb.Helpers.puts,
      buffer = "\n";

  json.body.frames.forEach(function(frame) {
    buffer += "  " + frame.text + "\n";
  });

  puts(buffer);
};

exports.parseResponse = function(response) {
  if (response.command === "backtrace") {
    return this;
  }
};