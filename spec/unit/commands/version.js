describe("NodeDebugger", function() {
  describe("Commands", function() {
    describe("version", function() {
      before_each(function() {
        version = Object.create(NodeDebugger.Commands.Version);

        original_puts = NodeDebugger.Helpers.puts;
        puts_called_with = [];
        NodeDebugger.Helpers.puts = function(text) {
          puts_called_with.push(text);
        };

        original_prompt = NodeDebugger.EventListener.prompt;
        prompt_called = false;
        NodeDebugger.EventListener.prompt = function() {
          prompt_called = true;
        };
      });

      after_each(function() {
        NodeDebugger.Helpers.puts = original_puts;
        NodeDebugger.EventListener.prompt = original_prompt;
      });

      it("should output the ndb + node version", function() {
        version.run();
        puts_called_with[0].should.equal("ndb:          version 0.0.1");
        puts_called_with[1].should.equal("node (local): version " + process.version);
      });

      it("should output the prompt", function() {
        version.run();
        prompt_called.should.be(true);
      });

      it("should parse 'version' as the version", function() {
        version.parse("version")[0].should.equal(version);
      });

      it("should not parse 'foo'", function() {
        version.parse("foo").should.equal(undefined);
      });

      it("should parse 'v' as the version", function() {
        version.parse("v")[0].should.equal(version);
      });
    });
  });
});