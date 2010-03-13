JSpec.include({
  beforeSpec: function() {
    ndb = require("ndb");
    ndb.reset();

    connection = {
      setEncoding: function() {},
      addListener: function() {}
    };

    tcp = {
      createConnection: function() {
        return connection;
      }
    };

    ndb.Helpers.tcp = tcp;

    mock_stdio = {
      open: function() {},
      addListener: function() {}
    };

    ndb.Helpers.stdio = mock_stdio;
    ndb.Helpers.puts  = function() {};
    ndb.Helpers.print = function() {};
  }
});


