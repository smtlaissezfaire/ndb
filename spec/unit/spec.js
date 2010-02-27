describe('NodeDebugger', function() {
  describe('Client', function() {
    before_each(function() {
      tcp = {
        createConnection: function() {},
        setEncoding: function() {}
      };

      node_debugger = Object.create(NodeDebugger);
      node_debugger.print = function() {};
      node_debugger.puts  = function() {};
      node_debugger.tcp = tcp;
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
        port_received = null;

        node_debugger.tcp.createConnection = function(port) {
          port_received = port;
        };

        node_debugger.start();
        port_received.should.equal(5858);
      });

      it("should establish the connection on the correct port", function() {
        port_received = null;

        node_debugger.port = 6000;

        node_debugger.tcp.createConnection = function(port) {
          port_received = port;
        };

        node_debugger.start();
        port_received.should.equal(6000);
      });

      it("should speak in ascii", function() {
        encoding_received = null;

        tcp.setEncoding = function(encoding) {
          encoding_received = encoding;
        };

        node_debugger.start();
        encoding_received.should.equal("ascii");
      });
    });
  });
});