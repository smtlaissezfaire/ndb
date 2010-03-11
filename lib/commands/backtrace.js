exports.commandNames = ["bt", "backtrace"];

exports.parse = function(text) {
  return this.calling_module.Helpers.commonParse.call(this, text);
};

exports.run = function() {
  var ndb = this.calling_module,
      rw  = ndb.Commands.RawWrite;

  rw.run({
    type:    "request",
    command: "backtrace"
  });
};
