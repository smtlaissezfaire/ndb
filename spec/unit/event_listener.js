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

      describe("when passed in the correct content-length, but more content", function() {
        before_each(function() {
          obj1 = {"one": "two"};
          obj2 = {"three": "four"};

          message1 = SpecHelpers.makeResponse(JSON.stringify(obj1));
          message2 = SpecHelpers.makeResponse(JSON.stringify(obj2));

          text = message1;
          text += message2.slice(0, 10); // an arbitrary part of the second message
        });

        it("should parse only the json for the content-length given", function() {
          var received_obj = "";

          event_listner.receive(text, function(obj) {
            received_obj = obj;
          });

          _.isEqual(received_obj, obj1).should.be_true;
        });

        it("should keep around the buffer for the next request", function() {
          event_listner.receive(text);
          event_listner.buffer.should.equal(message2.slice(0, 10));
        });
      });

      describe("when passed multiple, completed messages", function() {
        before_each(function() {
          obj1 = {"one": "two"};
          obj2 = {"three": "four"};

          message1 = SpecHelpers.makeResponse(JSON.stringify(obj1));
          message2 = SpecHelpers.makeResponse(JSON.stringify(obj2));

          text = message1;
          text += message2;
        });

        it("should parse & run all of them", function() {
          var received_objects = [];

          event_listner.receive(text, function(obj) {
            received_objects.push(obj);
          });

          _.isEqual(received_objects, [obj1, obj2]).should.be_true;
        });
      });
    });
  });
});
