exports.commandNames = ["quit", "exit"];

exports.parseCommand = function(text) {
  return this.callingModule.Helpers.commonParse.call(this, text);
};

exports.run = function() {
  this.callingModule.Helpers.puts("bye!");
  process.exit();
};
