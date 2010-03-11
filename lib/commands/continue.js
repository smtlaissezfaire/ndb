exports.commandNames = ["c", "continue"];

exports.parse = function(text) {
  return this.calling_module.Helpers.commonParse.call(this, text);
};

exports.run = function(json) {
  this.calling_module.Commands.RawWrite.run({
    type:    "request",
    command: "continue"
  });
};
