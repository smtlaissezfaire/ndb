exports.parse = function(text) {
  if (text === "bt" || text === "backtrace") {
    return [this];
  }
};

exports.run = function() {
  var ndb = this.calling_module,
      rw  = ndb.Commands.RawWrite;

  rw.run({
    type:    "request",
    command: "backtrace"
  });
};