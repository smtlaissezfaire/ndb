exports.commandNames = ["version"];

exports.parseCommand = function(text) {
  return this.callingModule.Helpers.commonParse.call(this, text);
};

exports.run = function() {
  var ndb     = this.callingModule,
      puts    = ndb.Helpers.puts,
      version = ndb.version;

  puts("ndb:          version " + version);
  puts("node (local): version " + process.version);
  ndb.Helpers.prompt();
};
