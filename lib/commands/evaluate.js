exports.commandNames = ["e", "evaluate", "print"];

exports.parse = function(text) {
  var match = /(e|eval|print) (.+)/.exec(text);

  if (match) {
    require("sys").puts(match[2]);
    return [this, match[2]];
  }
};

exports.run = function(expr) {
  var ndb = this.calling_module,
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
  var puts = this.calling_module.Helpers.puts;
  puts("=> " + json.body.text);
};
