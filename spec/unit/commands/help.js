describe("NodeDebugger", function() {
  describe("Commands", function() {
    describe("help", function() {
      before_each(function() {
        connection = {
          write: function() {}
        };

        commands = NodeDebugger.Commands;
        commands.connection = connection;

        help = commands.Help;
      });

      it("should output the help text", function() {
        var text = "";

        NodeDebugger.Helpers.puts = function(t) {
          text += t;
        };

        help.run();
        text.should.equal(help.text);
      });
    });
  });
});