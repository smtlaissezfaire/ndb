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

        writer = ndb.Commands.RawWrite;
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
          command: "source",
          arguments: {
            "fromLine": 1,
            "toLine":   6
          }
        };

        list.run();

        JSON.stringify(obj).should.equal(JSON.stringify(expected_object));
      });

      it("should use the line number from the break event", function() {
        ndb.State.lineNumber = 10;

        spy.spyOn(writer, function() {
          list.run();

          spy.intercepted(writer, "run", function(obj) {
            obj["arguments"].fromLine.should.equal(10);
            obj["arguments"].toLine.should.equal(15);
          });
        });
      });
    });
  });
});