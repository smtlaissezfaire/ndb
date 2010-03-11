NodeDebugger = require("ndb");

connection = {
  setEncoding: function() {},
  addListener: function() {}
};

tcp = {
  createConnection: function() {
    return connection;
  }
};

NodeDebugger.Helpers.tcp = tcp;

mock_stdio = {
  open: function() {},
  addListener: function() {}
};

NodeDebugger.Helpers.stdio = mock_stdio;
