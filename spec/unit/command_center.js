describe("NodeDebugger", function() {
  describe("CommandCenter", function() {
    before_each(function() {
      command_center          = ndb.CommandCenter;
      command_center.commands = ndb.Commands;
    });

    describe("parsing", function() {
      before_each(function() {
        out = "";

        ndb.Helpers.puts = function(t) {
          out += t;
        };
      });

      it("should return the RawWrite command when matching rw <some text>", function() {
        command_center.parse("rw {}").toString().should.equal([ndb.Commands.RawWrite, "{}"].toString());
      });

      it("should return the RawWrite command when matching any rw <some text>", function() {
        command_center.parse("rw {foo: bar}").toString().should.equal([ndb.Commands.RawWrite, "{foo: bar}"].toString());
      });

      it("should return the help command for 'help'", function() {
        command_center.parse("help").toString().should.equal([ndb.Commands.Help].toString());
      });

      it("should return the help command for 'h'", function() {
        command_center.parse("h").toString().should.equal([ndb.Commands.Help].toString());
      });

      it("should trim a command", function() {
        command_center.parse("      rw {foo: bar}         ").toString().should.equal([ndb.Commands.RawWrite, "{foo: bar}"].toString());
      });

      it("should parse l as a list command", function() {
        command_center.parse("l")[0].should.equal(ndb.Commands.List);
      });

      it("should parse 'list' as a list command", function() {
        command_center.parse("list")[0].should.equal(ndb.Commands.List);
      });

      it("should output the help command if it doesn't parse another command", function() {
        command_center.parse("asdfasdfasdfas").toString().should.equal([ndb.Commands.Help].toString());
      });

      it("should parse 'continue' as a continue command", function() {
        command_center.parse("continue")[0].should.equal(ndb.Commands.Continue);
      });

      it("should parse 'c' as a c command", function() {
        command_center.parse("c")[0].should.equal(ndb.Commands.Continue);
      });

      it("should parse 'b' as a break command", function() {
        command_center.parse("b")[0].should.equal(ndb.Commands.Break);
      });

      it("should parse 'break' as a break command", function() {
        command_center.parse("break")[0].should.equal(ndb.Commands.Break);
      });

      it("should parse version as the version", function() {
        var parse = command_center.parse("version");
        parse[0].should.equal(ndb.Commands.Version);
      });

      it('should parse break with one arg', function() {
        var parse = command_center.parse("break 10");

        parse[0].should.equal(ndb.Commands.Break);
        parse[1].toString().should.equal(["10"].toString());
      });

      it("should parse a break with multiple args", function() {
        var parse = command_center.parse("break foo.js 10");

        parse[0].should.equal(ndb.Commands.Break);
        parse[1].toString().should.equal(["foo.js", "10"].toString());
      });
    });

    describe("loop", function() {
      it("should set the connection of the commands object", function() {
        command_center.connection = {};

        command_center.loop();
        command_center.commands.connection.should.equal(command_center.connection);
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
  });
});
