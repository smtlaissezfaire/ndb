exports.commandNames = ["s", "step", "stepin"];

exports.parseCommand = function(text) {
  var ndb = this.callingModule;
  return ndb.Helpers.commonParse.call(this, text);
};

exports.run = function(stepcount) {
  var ndb = this.callingModule,
      rw = ndb.Commands.RawWrite;

  if (stepcount === undefined) {
    stepcount = 1;
  }

  rw.run({
    type:    "request",
    command: "continue",
    arguments: {
      stepaction: "in",
      stepcount: stepcount
    }
  });
};
