exports.commandNames = ["version"];

exports.parseCommand = function(text) {
  return this.calling_module.Helpers.commonParse.call(this, text);
};

exports.run = function() {
  var ndb     = this.calling_module,
      puts    = ndb.Helpers.puts,
      version = ndb.version;

  puts("ndb:          version " + version);
  puts("node (local): version " + process.version);
  ndb.Helpers.prompt();
};
