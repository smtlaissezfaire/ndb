var ndb = require("ndb");

exports.ndb = ndb;

exports.commandNames = ["e", "eval", "p", "print"];

exports.parseCommand = function(text) {
  var regex = new RegExp("^(" + this.commandNames.join("|") + ") (.+)$"),
      match = regex.exec(text);

  if (match) {
    return [this, match[2]];
  }
};

exports.run = function(expr, raw, callback) {
  var ndb       = this.ndb,
      raw_write = ndb.Commands.RawWrite;

  raw_write.run({
    type:    "request",
    command: "evaluate",
    arguments: {
      expression: expr
    }
  });
};

exports.output = function(json) {
  var puts = this.ndb.Helpers.puts;

  if (json.success) {
    puts("=> " + json.body.text);
  } else {
    puts(json.message);
  }
};

exports.parseResponse = function(obj) {
  if (obj.command === "evaluate") {
    return this;
  }
};
