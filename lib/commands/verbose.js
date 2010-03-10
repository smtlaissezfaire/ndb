exports.parse = function(text) {
  if (text === "verbose") {
    return [this];
  }
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