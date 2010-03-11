describe("NodeDebugger", function() {
  describe("Commands", function() {
    describe("backtrace", function() {
      before_each(function() {
        backtrace = NodeDebugger.Commands.Backtrace;
      });

      describe("parsing", function() {
        it("should not parse with random text", function() {
          backtrace.parse("fooasdfasd").should.equal(undefined);
        });

        it("should parse bt", function() {
          backtrace.parse("bt")[0].should.equal(backtrace);
        });

        it("should parse backtrace", function() {
          backtrace.parse("backtrace")[0].should.equal(backtrace);
        });
      });

      describe("running", function() {
        before_each(function() {
          raw_write = NodeDebugger.Commands.RawWrite;
          spy.stub(raw_write, "run");
        });

        // {"seq":117,"type":"request","command":"backtrace"}
        // {"seq":118,"type":"request","command":"backtrace","arguments":{"toFrame":2}}
        // {"seq":119,"type":"request","command":"backtrace","arguments":{"fromFrame":0,"toFrame":9}}
        it("should send the backtrace command", function() {
          spy.spyOn(raw_write, function() {
            backtrace.run();
            spy.intercepted(raw_write, "run", function(obj) {
              obj.type.should.equal("request");
              obj.command.should.equal("backtrace");
            });
          });
        });
      });
    });
  });
});