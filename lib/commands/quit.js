exports.commandNames = ["quit"];

exports.parse = function(text) {
  return this.calling_module.Helpers.commonParse.call(this, text);
};

exports.run = function() {
  this.calling_module.Helpers.puts("bye!");
  process.exit();
};
