describe("NodeDebugger", function() {
  describe("EventListener", function() {
    before_each(function() {
      event_listner = Object.create(NodeDebugger.EventListener);
    });

    it("should be in verbose mode by default", function() {
      event_listner.verbose.should.be(true);
    });

    it("should output the data received in verbose mode", function() {
      var text = "";

      NodeDebugger.Helpers.puts = function(t) {
        text += t;
      };

      event_listner.receive("{}");

      text.should.equal("<<<: {}");
    });

    it("should not output the data received when not in verbose mode", function() {
      var text = "";

      NodeDebugger.Helpers.puts = function(t) {
        text += t;
      };

      event_listner.verbose = false;

      event_listner.receive("{}");

      text.should.equal("");
    });

    it("should not raise an error if it cannot parse the json given", function() {
      var text = "";

      NodeDebugger.Helpers.puts = function(t) {
        text += t;
      };

      event_listner.verbose = true;

      event_listner.receive("foo");

      text.should.equal("<<<: foo");
    });

    it("should output the repl text", function() {
      var text = "";

      NodeDebugger.Helpers.print = function(t) {
        text += t;
      };

      event_listner.receive("foo");

      text.search(/ndb\> /).should.not.equal(-1);
    });
  });
});
