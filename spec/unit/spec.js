describe('NodeDebugger', function() {
  describe('Client', function() {
    before_each(function() {
      command_center = {
        loop: function() {}
      };

      ndb.commandCenter = command_center;
    });

    describe("starting", function() {
      it("should output welcome text", function() {
        var text = "";

        ndb.Helpers.puts = function(t) {
          text += t;
        };

        ndb.start();

        text.search(/welcome to the node debugger!/).should.not.equal(-1);
      });

      it("should have the default port as 5858", function() {
        ndb.port.should.equal(5858);
      });

      it("should establish the connection on port 5858", function() {
        var port_received = null;

        tcp.createConnection = function(port) {
          port_received = port;
          return connection;
        };

        ndb.start();
        port_received.should.equal(5858);
      });

      it("should establish the connection on the correct port", function() {
        var port_received = null;

        ndb.port = 6000;

        tcp.createConnection = function(port) {
          port_received = port;
          return connection;
        };

        ndb.start();
        port_received.should.equal(6000);
      });

      it("should speak in ascii", function() {
        var encoding_received = null;

        connection.setEncoding = function(encoding) {
          encoding_received = encoding;
        };

        ndb.start();
        encoding_received.should.equal("ascii");
      });

      it("should set the command center's connection", function() {
        ndb.start();

        command_center.connection.should.equal(connection);
      });

      it("should call the commandCenter's loop method", function() {
        var loop_called = false;

        command_center.loop = function() {
          loop_called = true;
        };

        ndb.start();

        loop_called.should.be(true);
      });

      it("should install the connection's event listener", function() {
        var called = false;

        connection.addListener = function() {
          called = true;
        };

        ndb.start();
        called.should.be(true);
      });
    });
  });
});
