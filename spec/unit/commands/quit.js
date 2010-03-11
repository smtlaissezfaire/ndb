describe("NodeDebugger", function() {
  describe("Commands", function() {
    describe("quitting", function() {
      before_each(function() {
        original_exit = process.quit;
        exit_called = false;
        process.exit = function() {
          exit_called = true;
        };

        original_puts = NodeDebugger.Helpers.puts;
        puts_called_with = undefined;
        NodeDebugger.Helpers.puts = function(text) {
          puts_called_with = text;
        };

        quitter = Object.create(NodeDebugger.Commands.Quit);
      });

      after_each(function() {
        process.exit = original_exit;
        NodeDebugger.Helpers.puts = original_puts;
      });

      it("should quit", function() {
        quitter.run();
        exit_called.should.be(true);
      });

      it("should output a message", function() {
        quitter.run();
        puts_called_with.should.equal("bye!");
      });

      it("should parse 'quit' as quit", function() {
        quitter.parse("quit")[0].should.equal(quitter);
      });
    });
  });
});
