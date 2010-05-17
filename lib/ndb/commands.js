var ndb = require("ndb");

function library_require(filename, object) {
  var mod = require(filename);
  mod.ndb = object;
  return mod;
}

exports.List          = library_require("./commands/list",          ndb);
exports.RawWrite      = library_require("./commands/raw_write",     ndb);
exports.Help          = library_require("./commands/help",          ndb);
exports.SetBreakpoint = library_require("./commands/setbreakpoint", ndb);
exports.Break         = library_require("./commands/break",         ndb);
exports.Continue      = library_require("./commands/continue",      ndb);
exports.Next          = library_require("./commands/next",          ndb);
exports.Evaluate      = library_require("./commands/evaluate",      ndb);
exports.Quit          = library_require("./commands/quit",          ndb);
exports.Version       = library_require("./commands/version",       ndb);
exports.Verbose       = library_require("./commands/verbose",       ndb);
exports.Backtrace     = library_require("./commands/backtrace",     ndb);
exports.StepIn        = library_require("./commands/step_in",       ndb);
