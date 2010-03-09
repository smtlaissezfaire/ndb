exports.run = function() {
  var ndb     = this.calling_module,
      puts    = ndb.Helpers.puts,
      version = ndb.version;

  puts("ndb:          version " + version);
  puts("node (local): version " + process.version);
  ndb.EventListener.prompt();
};

exports.parse = function(text) {
  if (text === "version" || text === "v") {
    return [this];
  }
};