describe("NodeDebugger", function() {
  describe("Commands", function() {
    describe("RawWrite", function() {
      before_each(function() {
        connection = {
          write: function() {}
        };

        commands = NodeDebugger.Commands;
        commands.connection = connection;
      });

      it("should write the json to the connection", function() {
        text = "";
        connection.write = function(t) { text += t; };

        commands.RawWrite.run("{some: json}");

        text.should.match(/\{some\: json\}/);
      });

      it("should output the correct json", function() {
        text = "";
        connection.write = function(t) { text += t; };

        commands.RawWrite.run("{foo: bar}");

        text.should.match(/\{foo\: bar\}/);
      });

      it("should output a final \\n at the end of the json", function() {
        text = "";
        connection.write = function(t) { text += t; };

        commands.RawWrite.run("{foo: bar}");

        text.should.match(/\{foo\: bar\}\n/);
      });

      it("should output the content length header before the text, as well as two \\r\\n's", function() {
        text = "";
        connection.write = function(t) { text += t; };

        commands.RawWrite.run("{foo: bar}");

        text.should.match(/Content-Length: 11\r\n\r\n\{foo\: bar\}\n/);
      });

      it("should output the correct content length", function() {
        text = "";
        connection.write = function(t) { text += t; };

        commands.RawWrite.run("{a: b}");

        text.should.match(/Content-Length: 7\r/);
      });

      it("should JSON.stringify an object", function() {
        text = "";
        connection.write = function(t) { text += t; };

        commands.RawWrite.run({foo: 'bar'});

        var str = JSON.stringify({foo: 'bar'});

        text.should.match(str);
      });
    });
  });
});