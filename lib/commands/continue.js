exports.run = function(json) {
  this.calling_module.Commands.RawWrite.run({
    type:    "request",
    command: "continue"
  });
};

exports.parse = function(text) {
  if (text === "c" || text === "continue") {
    return [this];
  }
};
