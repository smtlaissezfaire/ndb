describe("NodeDebugger", function() {
  describe("EventListener", function() {
    before_each(function() {
      event_listner = ndb.EventListener;
      header = "Content-Length: 1\r\n\r\n";
    });

    describe("for a source event", function() {
      before_each(function() {
        event_listner.verbose = false;

        out = "";

        ndb.Helpers.puts = function(t) {
          out += t;
        };

        source = "";
        source += "function() {\n";
        source += "  a += 1;\n";
        source += "  b += 2;\n";
        source += "}\n";

        obj = {
          "seq":      2,
          "type":     "response",
          "command":  "source",
          "success":  true,
          "body": {
            "source":       source,
            "fromLine":     0,
            "toLine":       4,
            "fromPosition": 0,
            "toPosition":   88,
            "totalLines":   4
          },
          "refs": [],
          "running": false
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
        var lines = obj.body.source.split("\n");

        var expected_output = "";
        expected_output += "   1 " + lines[0] + "\n";
        expected_output += "   2 " + lines[1] + "\n";
        expected_output += "   3 " + lines[2] + "\n";
        expected_output += "   4 " + lines[3] + "\n";

        event_listner.receive(header + JSON.stringify(obj));

        out.should.equal(expected_output);
      });

      it("should output when the content-length header is included", function() {
        var header = "Content-Length: 270\r\n\r\n";

        event_listner.receive(header + JSON.stringify(obj));

        (/function\(\) \{/).test(out).should.be(true);
      });

      it("should ignore all headers", function() {
        var headers = "Content-Length: 270\r\nFoo: bar\r\n\r\n";

        event_listner.receive(headers + JSON.stringify(obj));

        (/function\(\) \{/).test(out).should.be(true);
      });
    });
  });
});