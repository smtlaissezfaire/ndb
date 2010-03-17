exports.commandNames = ["l", "list"];

exports.parse = function(text) {
  return this.calling_module.Helpers.commonParse.call(this, text);
};

exports.run = function() {
  var ndb    = this.calling_module,
      writer = ndb.Commands.RawWrite;

  writer.run({
    type:    "request",
    command: "source",
    arguments: {
      fromLine: ndb.State.lineNumber,
      toLine:   ndb.State.lineNumber + 5
    }
  });
};

function constructString(obj) {
  var source   = obj.body.source.split("\n"),
      fromLine = obj.body.fromLine,
      toLine   = obj.body.toLine,
      str      = "",
      sourceNum,
      i;

  for (i = 0; i < toLine; i++) {
    sourceNum = fromLine + i + 1;
    str += "   " + sourceNum + " " + source[i] + "\n";
  }

  return str;
}

exports.output = function(obj) {
  var puts = this.calling_module.Helpers.puts;
  puts(constructString(obj));
};

