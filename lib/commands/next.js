exports.commandNames = ["n", "next"];

exports.parse = function(text) {
  var match = /(n|next)(.*)/.exec(text),
      args;

  if (match) {
    args = match[2].trim();

    if (args === "") {
      return [this];
    } else {
      return [this, match[2].trim()];
    }
  }
};

exports.run = function(stepcount) {
  var ndb = this.calling_module,
      rw = ndb.Commands.RawWrite,
      obj;

  obj = {
    type: "request",
    command: "continue",
    arguments: {
      stepaction: "next"
    }
  };

  if (stepcount) {
    obj.arguments.stepcount = stepcount;
  }

  rw.run(obj);
};
