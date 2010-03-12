SpecHelpers = {};
SpecHelpers.clone = function(source) {
  var clone,
      key;

  try {
    clone = Object.create(source);
  } catch (_) {
    return source;
  }

  for (key in clone) {
    if (clone.hasOwnProperty(key)) {
      clone[key] = SpecHelpers.clone(clone[key]);
    }
  }

  return clone;
};

JSpec.include({
  beforeSpec: function() {
    ndb = SpecHelpers.clone(require("ndb"));

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


