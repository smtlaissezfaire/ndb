SpecHelpers = {
  makeHeader: function(content) {
    return "Content-Length: " + content.length + "\r\n\r\n";
  },

  makeResponse: function(content) {
    return SpecHelpers.makeHeader(content) + content;
  }
};

JSpec.include({
  beforeSpec: function() {
    ndb = require("ndb");
    ndb.reset();
    ndb.Commands.List.context = 2;

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


