var sys = require("sys"),
    tcp = require("tcp");

NodeDebugger = {
  print: sys.printf,
  puts:  sys.puts,
  tcp:   tcp,
  port:  5858,

  start: function() {
    var tcp   = this.tcp,
        puts  = this.puts;

    puts("welcome to the node debugger!");

    tcp.createConnection(this.port);
    tcp.setEncoding("ascii");
  },

  CommandCenter: (function() {
    var parse_command = function(command, text, fun) {
      if (text.match("^" + command + " ")) {
        return true;
      } else {
        return false;
      }
    };

    return {
      print: sys.print,
      puts:  sys.puts,

      parse: function(text) {
        var puts     = this.puts,
            commands = NodeDebugger.Commands;

        if (parse_command("rw", text)) {
          return commands.raw_write;
        } else {
          puts("unknown command: " + text);
          return null;
        }
      },

      loop: function() {
        var print = this.print;

        print("ndb> ");
      }
    };
  })(),

  Commands: {
    raw_write: function(json) {
      var content_length = json.length,
          connection     = this.connection;

      connection.write("Content-Length: " + content_length + "\r\n\r\n" + json + "\n");
    }
  }
};