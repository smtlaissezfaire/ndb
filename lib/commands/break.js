exports.commandNames = ["b", "break"];

exports.parse = function(text) {
  var obj = {},
      array;

  if (text == "b" || text == "break") {
    return [this, obj];
  }

  var match = new RegExp("^break (.+)").exec(text);

  if (match === null) {
    return false;
  } else {
    array = match[1].split(":");

    if (array.length === 1) {
      obj.lineNumber = array[0];
    } else {
      obj.filename = array[0];
      obj.lineNumber = array[1];
    }

    obj.lineNumber = parseInt(obj.lineNumber, "10");

    return([this, obj]);
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

  if (json.body) {
    ndb.State.lineNumber = json.body.sourceLine + 1;

    if (json.body.script) {
      script = json.body.script;

      if (script.name) {
        ndb.State.filename = script.name;
      }
    }
  }

  puts(constructSource(json));
};

exports.run = function() {
  var obj = arguments[0] || {},
      ndb  = this.calling_module,
      file = obj.filename || ndb.State.filename,
      line = obj.lineNumber || ndb.State.lineNumber || 1;

  ndb.Commands.RawWrite.run({
    type:    "request",
    command: "setbreakpoint",
    arguments: {
      type:   "script",
      target: file,
      line:   line
    }
  });
};
