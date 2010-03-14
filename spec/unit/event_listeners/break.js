describe("NodeDebugger", function() {
  describe("EventListener", function() {
    before_each(function() {
      event_listner = ndb.EventListener;
      ndb.verbose = false;
    });

    describe("for a break event", function() {
      before_each(function() {
        out = "";

        ndb.Helpers.puts = function(t) {
          out += t;
        };
      });

      // {"seq":117,"type":"event","event":"break","body":{"functionName":"f","sourceLine":1,"sourceColumn":14}}

      it("should output a break event", function() {
        var json = '{"seq":117,"type":"event","event":"break","body":{"functionName":"f","sourceLine":1,"sourceColumn":14}}';

        event_listner.receive(SpecHelpers.makeResponse(json));

        out.should.equal("Breakpoint at 1:14 (in function f)");
      });

      it("should buffer the data", function() {
        var json = '{"seq":117,"type":"event","event":"break","bo';
        var json2 = 'dy":{"functionName":"f","sourceLine":1,"sourceColumn":14}}';

        event_listner.receive(SpecHelpers.makeHeader(json + json2) + json);
        event_listner.receive(json2);

        out.should.equal("Breakpoint at 1:14 (in function f)");
      });

      it("should reset the buffer after a successful call", function() {
        var json = '{"seq":117,"type":"event","event":"break","body":{"functionName":"f","sourceLine":1,"sourceColumn":14}}';

        event_listner.receive(SpecHelpers.makeResponse(json));

        event_listner.buffer.should.equal("");
      });

      it("should use the correct source column number", function() {
        var json = '{"seq":117,"type":"event","event":"break","body":{"functionName":"f","sourceLine":1,"sourceColumn":6}}';

        event_listner.receive(SpecHelpers.makeResponse(json));

        out.should.equal("Breakpoint at 1:6 (in function f)");
      });

      it("should use the correct source line number", function() {
        var json = '{"seq":117,"type":"event","event":"break","body":{"functionName":"f","sourceLine":2,"sourceColumn":14}}';

        event_listner.receive(SpecHelpers.makeResponse(json));

        out.should.equal("Breakpoint at 2:14 (in function f)");
      });

      it("should use the correct function name", function() {
        var json = '{"seq":117,"type":"event","event":"break","body":{"functionName":"foo","sourceLine":1,"sourceColumn":14}}';

        event_listner.receive(SpecHelpers.makeResponse(json));

        out.should.equal("Breakpoint at 1:14 (in function foo)");
      });

      // {"seq":117,"type":"event","event":"break","body":{"functionName":"g","scriptData":"test.js","sourceLine":12,"sourceColumn":22,"breakpoints":[1]}}

      it("should output the filename + breakpoints when given", function() {
        var json = '{"seq":117,"type":"event","event":"break","body":{"functionName":"g","scriptData":"test.js","sourceLine":12,"sourceColumn":22,"breakpoints":[1]}}';

        event_listner.receive(SpecHelpers.makeResponse(json));

        out.should.equal("Breakpoint at test.js:12:22 (in function g - breakpoints: [1])");
      });

      // {"seq":117,"type":"event","event":"break","body":{"functionName":"h","sourceLine":100,"sourceColumn":12,"breakpoints":[3,5,7]}}
      it("should output multiple breakpoints", function() {
        var json = '{"seq":117,"type":"event","event":"break","body":{"functionName":"h","sourceLine":100,"sourceColumn":12,"breakpoints":[3,5,7]}}';

        event_listner.receive(SpecHelpers.makeResponse(json));

        out.should.equal("Breakpoint at 100:12 (in function h - breakpoints: [3,5,7])");
      });

      it("should output the sourceline if one is given", function() {
        var json = '{"seq":117,"type":"event","event":"break","body":{"functionName":"h","sourceLine":100,"sourceColumn":12,"sourceLineText":"foo() {};"}}';

        event_listner.receive(SpecHelpers.makeResponse(json));

        var regex = new RegExp(/foo\(\)\ \{\}\;/);
        out.search(regex).should.not.equal(-1);
      });
    });
  });
});
