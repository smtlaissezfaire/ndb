exports.commandNames = ["b", "break"];

exports.parse = function(text) {
  if (text == "b" || text == "break") {
    return [this];
  }

  var match = new RegExp("^break (.+)").exec(text);

  if (match === null) {
    return false;
  } else {
    return [this, match[1].split(" ")];
  }
};

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
  var ndb  = this.calling_module,
      puts = ndb.Helpers.puts,
      script;

  if (json.body && json.body.script) {
    script = json.body.script;

    if (script.name) {
      ndb.State.filename = script.name;
    }

    if (script.lineOffset !== null) {
      ndb.State.lineNumber = script.lineOffset + 1;
    }
  }

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
