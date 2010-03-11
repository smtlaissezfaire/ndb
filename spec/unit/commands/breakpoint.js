describe("NodeDebugger", function() {
  describe("Commands", function() {
    describe("Breakpoint", function() {
      before_each(function() {
        connection = {
          write: function() {}
        };

        commands = NodeDebugger.Commands;
        commands.connection = connection;

        breakpoint = commands.Break;
      });

      it("should raw write the json with the filename + fileno", function() {
        var obj = undefined;

        NodeDebugger.Commands.RawWrite = {
          run: function(o) {
            obj = o;
          }
        };

        var expected_object = {
          type:    "request",
          command: "setbreakpoint",
          arguments: {
            type:   "script",
            target: "filename.js",
            line:   17
          }
        };

        breakpoint.run("filename.js", 17);

        JSON.stringify(obj).should.equal(JSON.stringify(expected_object));
      });

      it('should use the correct filename + lineno', function() {
        var obj = undefined;

        NodeDebugger.Commands.RawWrite = {
          run: function(o) {
            obj = o;
          }
        };

        var expected_object = {
          type:    "request",
          command: "setbreakpoint",
          arguments: {
            type:   "script",
            target: "foo.js",
            line:   20
          }
        };

        breakpoint.run("foo.js", 20);

        JSON.stringify(obj).should.equal(JSON.stringify(expected_object));
      });

      it("should be able set a breakpoint with a number in the current filename", function() {});

      it("should be able to set a breakpoint with a function name", function() {});
    });
  });
});
