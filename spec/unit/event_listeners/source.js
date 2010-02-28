describe("NodeDebugger", function() {
  describe("EventListener", function() {
    before_each(function() {
      event_listner = Object.create(NodeDebugger.EventListener);
    });

    describe("for a source event", function() {
      before_each(function() {
        event_listner.verbose = false;

        out = "";

        NodeDebugger.Helpers.puts = function(t) {
          out += t;
        };
      });

      // { "seq"         : <number>,
      //   "type"        : "response",
      //   "request_seq" : <number>,
      //   "command"     : "source",
      //   "body"        : { "source"       : <the source code>
      //                     "fromLine"     : <actual from line within the script>
      //                     "toLine"       : <actual to line within the script this line is not included in the source>
      //                     "fromPosition" : <actual start position within the script>
      //                     "toPosition"   : <actual end position within the script>
      //                     "totalLines"   : <total lines in the script>
      //                 }
      //   "running"     : <is the VM running after sending this response>
      //   "success"     : true
      // }

      it("should output the source code", function() {
        var obj = {
          "seq":      2,
          "type":     "response",
          "command":  "source",
          "success":  true,
          "body": {
            "source": "(function (exports, require, module, __filename, __dirname) { function foo() {\n  \n}\n});",
            "fromLine":     0,
            "toLine":       4,
            "fromPosition": 0,
            "toPosition":   88,
            "totalLines":   4
          },
          "refs": [],
          "running": false
        };

        var expected_output = "";
        expected_output += "     1 | (function (exports, require, module, __filename, __dirname) { function foo() {";
        expected_output += "     2 |   ";
        expected_output += "     3 | }";
        expected_output += "     4 | });";
        expected_output = expected_output.replace(/\s+/, "");

        event_listner.receive(JSON.stringify(obj));

        out.replace(/\s+/, "").should.equal(expected_output);
      });
    });
  });
});