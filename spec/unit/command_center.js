describe("NodeDebugger", function() {
  describe("CommandCenter", function() {
    before_each(function() {
      command_center = Object.create(NodeDebugger.CommandCenter);
    });

    it("should output the repl text", function() {
      var text = "";

      command_center.print = function(t) {
        text += t;
      };

      command_center.loop();

      text.search(/ndb\> /).should.not.equal(-1);
    });

    describe("parsing", function() {
      before_each(function() {
        out = "";

        command_center.puts = function(t) {
          out += t;
        };
      });

      it("should return the raw_write command when matching rw <some text>", function() {
        command_center.parse("rw {}").should.equal(NodeDebugger.Commands.raw_write);
      });

      it("should return the raw_write command when matching any rw <some text>", function() {
        command_center.parse("rw {foo: bar}").should.equal(NodeDebugger.Commands.raw_write);
      });

      it("should not return the raw_write command when matching rw at the end of the string", function() {
        command_center.parse("foo rw");
        out.should.equal("unknown command: foo rw");
      });

      it("should see anything else as an error", function() {
        command_center.parse("foo");
        out.should.equal("unknown command: foo");
      });

      it("should output the correct error", function() {
        command_center.parse("bar");
        out.should.equal("unknown command: bar");
      });
    });
  });
});