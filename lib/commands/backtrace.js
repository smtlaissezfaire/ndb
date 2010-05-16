exports.commandNames = ["bt", "backtrace"];

exports.parseCommand = function(text) {
  return this.calling_module.Helpers.commonParse.call(this, text);
};

exports.run = function() {
  var ndb = this.calling_module,
      rw  = ndb.Commands.RawWrite;

  rw.run({
    type:    "request",
    command: "backtrace"
  });
};

exports.output = function(json) {
  var ndb    = this.calling_module,
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