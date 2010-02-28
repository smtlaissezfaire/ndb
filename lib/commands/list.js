exports.text = "list";

exports.run = function() {
  this.calling_module.Commands.RawWrite.run({
    type:    "request",
    command: "source"
  });
};