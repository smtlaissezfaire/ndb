exports.commandNames = ["verbose"];

exports.parse = function(text) {
  return this.calling_module.Helpers.commonParse.call(this, text);
};

function toggle(obj, value) {
  obj[value] = !obj[value];
}

function boolToName(value) {
  return (value ? "on" : "off");
}

exports.run = function() {
  var ndb    = this.calling_module,
      puts   = ndb.Helpers.puts,
      prompt = ndb.Helpers.prompt;

  toggle(ndb, "verbose");
  puts("verbose mode now " + boolToName(ndb.verbose));
  prompt();
};
