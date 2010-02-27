describe('NodeDebugger', function() {
  describe('Client', function() {
    before_each(function() {
      connection = {
        setEncoding: function() {},
        addListener: function() {}
      };

      tcp = {
        createConnection: function() {
          return connection;
        }
      };

      command_center = {
        loop: function() {}
      };

      node_debugger = Object.create(NodeDebugger);
      node_debugger.print         = function() {};
      node_debugger.puts          = function() {};
      node_debugger.tcp           = tcp;
      node_debugger.commandCenter = command_center;
    });

    describe("starting", function() {
      it("should output welcome text", function() {
        var text = "";

        node_debugger.puts = function(t) {
          text += t;
        };

        node_debugger.start();

        text.search(/welcome to the node debugger!/).should.not.equal(-1);
      });

      it("should have the default port as 5858", function() {
        node_debugger.port.should.equal(5858);
      });

      it("should establish the connection on port 5858", function() {
        var port_received = null;

        tcp.createConnection = function(port) {
          port_received = port;
          return connection;
        };

        node_debugger.start();
        port_received.should.equal(5858);
      });

      it("should establish the connection on the correct port", function() {
        var port_received = null;

        node_debugger.port = 6000;

        node_debugger.tcp.createConnection = function(port) {
          port_received = port;
          return connection;
        };

        node_debugger.start();
        port_received.should.equal(6000);
      });

      it("should speak in ascii", function() {
        var encoding_received = null;

        connection.setEncoding = function(encoding) {
          encoding_received = encoding;
        };

        node_debugger.start();
        encoding_received.should.equal("ascii");
      });

      it("should set the command center's connection", function() {
        node_debugger.start();

        command_center.connection.should.equal(connection);
      });

      it("should call the commandCenter's loop method", function() {
        var loop_called = false;

        command_center.loop = function() {
          loop_called = true;
        };

        node_debugger.start();

        loop_called.should.be(true);
      });

      it("should install the connection's event listener", function() {
        var called = false;

        connection.addListener = function() {
          called = true;
        };

        node_debugger.start();
        called.should.be(true);
      });
    });
  });
});