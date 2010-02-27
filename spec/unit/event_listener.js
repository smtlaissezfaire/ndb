describe("NodeDebugger", function() {
  describe("EventListener", function() {
    before_each(function() {
      event_listner = Object.create(NodeDebugger.EventListener);
      event_listner.puts = function() {};
    });

    it("should be in verbose mode by default", function() {
      event_listner.verbose.should.be(true);
    });

    it("should output the data received in verbose mode", function() {
      var text = "";

      event_listner.puts = function(t) {
        text += t;
      };

      event_listner.receive("{}");

      text.should.equal("received: {}");
    });

    it("should not output the data received when not in verbose mode", function() {
      var text = "";

      event_listner.puts = function(t) {
        text += t;
      };

      event_listner.verbose = false;

      event_listner.receive("{}");

      text.should.equal("");
    });
  });
});
