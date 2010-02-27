describe("NodeDebugger", function() {
  describe("CommandCenter", function() {
    before_each(function() {
      mock_stdio = {
        open: function() {},
        addListener: function() {}
      };

      command_center = Object.create(NodeDebugger.CommandCenter);
      command_center.stdio = mock_stdio;
      command_center.print = function() {};
      command_center.commands = Object.create(NodeDebugger.Commands);
    });

    it("should output the repl text", function() {
      var text = "";

      command_center.print = function(t) {
        text += t;
      };

      command_center.prompt();

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
        command_center.parse("rw {}").toString().should.equal([NodeDebugger.Commands.raw_write, "{}"].toString());
      });

      it("should return the raw_write command when matching any rw <some text>", function() {
        command_center.parse("rw {foo: bar}").toString().should.equal([NodeDebugger.Commands.raw_write, "{foo: bar}"].toString());
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

    describe("loop", function() {
      it("should set the connection of the commands object", function() {
        command_center.connection = {};

        command_center.loop();
        command_center.commands.connection.should.equal(command_center.connection);
      });

      it('should display the prompt', function() {
        prompt_displayed = false;

        command_center.prompt = function() {
          prompt_displayed = true;
        };

        command_center.loop();
        prompt_displayed.should.be(true);
      });

      it('should open stdio', function() {
        opened = false;

        mock_stdio.open = function() {
          opened = true;
        };

        command_center.loop();
        opened.should.be(true);
      });
    });

    describe("stdinListener", function() {
      it("should call the function if parsed correctly", function() {
        var called = false;

        command_center.commands.raw_write = function() {
          called = true;
        };

        command_center.stdinListener("rw {}");
        called.should.be(true);
      });

      it("should call the function with arguments", function() {
        var called_with = undefined;

        command_center.commands.raw_write = function(arg) {
          called_with = arg;
        };

        command_center.stdinListener("rw {}");
        called_with.should.equal("{}");
      })
    });
  });
});