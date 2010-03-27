exports.commandNames = ["b", "break"];

exports.parseCommand = function(text) {
  var obj = {},
      array;

  if (text == "b" || text == "break") {
    return [this, obj];
  }

  var match = new RegExp("^b(reak)? (.+)").exec(text);

  if (match === null) {
    return false;
  } else {
    array = match[2].split(":");

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
