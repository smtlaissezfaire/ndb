describe("NodeDebugger", function() {
  describe("Commands", function() {
    describe("evaluate", function() {
      before_each(function() {
        evaluator = ndb.Commands.Evaluate;
        pretty_printer = ndb.Commands.PrettyPrint;

        raw_write = ndb.Commands.RawWrite;
        spy.stub(raw_write, "run");
      });

      it("should have the same commands as evaluate", function() {
        pretty_printer.ndb.should.equal(evaluator.ndb);
        pretty_printer.parseCommand.should.equal(evaluator.parseCommand);
        pretty_printer.parseResponse.should.equal(evaluator.parseResponse);
        pretty_printer.output.should.equal(evaluator.output);
      });

      describe("running", function() {
        it("should raw write the expression", function() {
          spy.spyOn(raw_write, function() {
            pretty_printer.run("1+2");
            spy.intercepted(raw_write, "run").should.be(true);
          });
        });

        it("should raw write with the expression", function() {
          spy.spyOn(raw_write, function() {
            pretty_printer.run("1+2", true);
            spy.intercepted(raw_write, "run", function(obj) {
              obj.type.should.equal("request");
              obj.command.should.equal("evaluate");
              obj.arguments.expression.should.equal("global.___ndb_require(\"util\").inspect(\"1+2\")");
            });
          });
        });

        it("should use the correct expression", function() {
          spy.spyOn(raw_write, function() {
            pretty_printer.run("a()", true);

            spy.intercepted(raw_write, "run", function(obj) {
              obj.arguments.expression.should.equal("global.___ndb_require(\"util\").inspect(\"a()\")");
            });
          });
        });
      });
    });
  });
});
