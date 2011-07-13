var evaluate = require(__dirname + "/evaluate");

exports.ndb           = evaluate.ndb;
exports.parseCommand  = evaluate.parseCommand;
exports.parseResponse = evaluate.parseResponse;
exports.output        = evaluate.output;

exports.commandNames = ["pp", "prettyprint"];

exports.run = function(expr, raw) {
  var modifiedExpression = 'global.___ndb_require("util").inspect(' + JSON.stringify(expr) + ')';
  evaluate.run(modifiedExpression, raw);
};
