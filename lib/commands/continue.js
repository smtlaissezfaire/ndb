exports.run = function(json) {
  this.calling_module.Commands.RawWrite.run({
    type:    "request",
    command: "continue"
  });
};
