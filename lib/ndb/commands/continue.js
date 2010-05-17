exports.commandNames = ["c", "continue"];

exports.parseCommand = function(text) {
  return this.callingModule.Helpers.commonParse.call(this, text);
};

exports.run = function(json) {
  this.callingModule.Commands.RawWrite.run({
    type:    "request",
    command: "continue"
  });
};
