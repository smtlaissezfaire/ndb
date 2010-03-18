describe("NodeDebugger", function() {
  describe("Commands", function() {
    describe("Breakpoint", function() {
      before_each(function() {
        breakpoint = commands.Break;

        expected_object = {
          type:    "request",
          command: "setbreakpoint",
          arguments: {
            type:   "script",
            target: "filename.js",
            line:   17
          }
        };

        obj = {};

        spy.stub(ndb.Commands.RawWrite, "run", function(arg) {
          obj = arg;
        });
      });

      it("should raw write the json with the filename + fileno", function() {
        breakpoint.run({filename: "filename.js", lineNumber: 17});
        _.isEqual(obj, expected_object).should.be(true);
      });

      it('should use the correct filename + lineno', function() {
        breakpoint.run({filename: "foo.js", lineNumber: 20});
        obj.arguments.target.should.equal("foo.js");
        obj.arguments.line.should.equal(20);
      });

      it("should use the current filename if none is provided", function() {
        ndb.State.filename = "/my/filename.js";

        breakpoint.run({lineNumber: 20});

        obj.arguments.target.should.equal("/my/filename.js");
        obj.arguments.line.should.equal(20);
      });

      it("should use the current line number + filename if none provided", function() {
        ndb.State.filename = "/foo/bar.js";
        ndb.State.lineNumber = 10;

        breakpoint.run();
        obj.arguments.target.should.equal("/foo/bar.js");
        obj.arguments.line.should.equal(10);
      });

      it("should use line 1 if line number is not set", function() {
        breakpoint.run();
        obj.arguments.line.should.equal(1);
      });

      it("should not set the filename if not set (either globally or passed)", function() {
        breakpoint.run();
        obj.arguments.target.should.equal(null);
      });
    });
  });
});