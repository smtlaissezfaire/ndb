describe("NodeDebugger", function() {
  describe("EventListener", function() {
    before_each(function() {
      event_listner = ndb.EventListener;
    });

    it("should output the data received in verbose mode", function() {
      var text = "";

      ndb.Helpers.puts = function(t) {
        text += t;
      };

      ndb.verbose = true;
      event_listner.receive("{}");
      text.should.equal("verbose: <<< {}");
    });

    it("should not output the data received when not in verbose mode", function() {
      var text = "";

      ndb.Helpers.puts = function(t) {
        text += t;
      };

      ndb.verbose = false;
      event_listner.receive("{}");
      text.should.equal("");
    });

    it("should not raise an error if it cannot parse the json given", function() {
      var text = "";

      ndb.Helpers.puts = function(t) {
        text += t;
      };

      ndb.verbose = true;
      event_listner.receive("foo");
      text.should.equal("verbose: <<< foo");
    });

    it("should output the repl text", function() {
      var text = "";

      ndb.Helpers.print = function(t) {
        text += t;
      };

      ndb.verbose = true;
      event_listner.receive("foo");
      text.search(/ndb\> /).should.not.equal(-1);
    });

    describe("handling the content-length", function() {
      it("should reset the buffer to the empty string when Content-Length: 0", function() {
        var message = "";

        event_listner.receive(SpecHelpers.makeResponse(message));
        event_listner.buffer.should.equal("");
      });
    });
  });
});
