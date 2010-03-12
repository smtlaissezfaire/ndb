describe("NodeDebugger", function() {
  describe("Commands", function() {
    describe("List", function() {
      before_each(function() {
        connection = {
          write: function() {}
        };

        commands = ndb.Commands;
        commands.connection = connection;

        list = commands.List;
      });

      it("should raw write the json", function() {
        var obj = undefined;

        ndb.Commands.RawWrite = {
          run: function(o) {
            obj = o;
          }
        };

        var expected_object = {
          type:    "request",
          command: "source"
        };

        list.run();

        JSON.stringify(obj).should.equal(JSON.stringify(expected_object));
      });
    });
  });
});