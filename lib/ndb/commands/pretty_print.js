var evaluate = require(__dirname + "/evaluate");

exports.ndb           = evaluate.ndb;
exports.parseCommand  = evaluate.parseCommand;
exports.output        = evaluate.output;

// this is already parsed by evaluate
exports.parseResponse = function() { return false; };

exports.commandNames = ["pp", "prettyprint"];

exports.run = function(expr, raw) {
  var modifiedExpression = 'global.___ndb_require("util").inspect(' + expr + ')';
  evaluate.run(modifiedExpression, raw);
};
