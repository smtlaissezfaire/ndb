var ndb = require("ndb");

exports.ndb = ndb;

exports.commandNames = ["q", "quit", "exit"];

exports.parseCommand = function(text) {
  return this.ndb.Helpers.commonParse.call(this, text);
};

exports.run = function() {
  this.ndb.Helpers.puts("bye!");
  process.exit();
};
