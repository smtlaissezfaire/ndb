exports.commandNames = ["e", "eval", "p", "print"];

exports.parse = function(text) {
  var match = new RegExp("(" + this.commandNames.join("|") + ") (.+)").exec(text);

  if (match) {
    return [this, match[2]];
  }
};

exports.run = function(expr, raw) {
  var ndb = this.calling_module,
      raw_write = ndb.Commands.RawWrite;

  if (raw === false || raw === undefined) {
    expr = "require('sys').inspect(" + expr + ");";
  }

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
