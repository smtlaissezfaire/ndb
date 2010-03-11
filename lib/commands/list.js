exports.run = function() {
  this.calling_module.Commands.RawWrite.run({
    type:    "request",
    command: "source"
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

exports.parse = function(text) {
  if (text === "l" || text === "list") {
    return [this];
  }
};