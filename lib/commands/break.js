function constructSource(obj, puts) {
  var str = "";

  var body = obj.body;

  str += "Breakpoint at ";

  if (body.scriptData) {
    str += body.scriptData + ":";
  }

  str += body.sourceLine + ":" + body.sourceColumn;
  str += " (in function " + body.functionName;

  if (body.breakpoints) {
    str += " - breakpoints: [" + body.breakpoints + "]";
  }

  str += ")";

  if (body.sourceLineText) {
    str += body.sourceLineText;
  }

  return str;
}

exports.output = function(json) {
  var puts = this.calling_module.Helpers.puts;
  puts(constructSource(json));
};

exports.run = function() {
  var file_name = arguments[0];
  var file_number = arguments[1];

  this.calling_module.Commands.RawWrite.run({
    type:    "request",
    command: "setbreakpoint",
    arguments: {
      type:   "script",
      target: file_name,
      line:   file_number
    }
  });
};
