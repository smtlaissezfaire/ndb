var ndb = require("ndb");

exports.ndb = ndb;

exports.commandNames = ["silent"];

exports.parseCommand = function(text) {
  return this.ndb.Helpers.commonParse.call(this, text);
};

exports.run = function() {
  ndb.silent = true;
};
