var sys = require("sys"),
    tcp = require("tcp");

NodeDebugger = {
  print: sys.printf,
  puts:  sys.puts,
  tcp:   tcp,
  port:  5858,

  start: function() {
    var tcp           = this.tcp,
        puts          = this.puts,
        commandCenter = this.commandCenter || Object.create(NodeDebugger.CommandCenter),
        connection;

    puts("welcome to the node debugger!");

    connection = tcp.createConnection(this.port);
    connection.setEncoding("ascii");

    commandCenter.connection = connection;
    commandCenter.loop();
  }
};

NodeDebugger.Commands = {
  raw_write: function(json) {
    var content_length = json.length,
        connection     = this.connection;

    connection.write("Content-Length: " + content_length + "\r\n\r\n" + json + "\n");
  }
};

NodeDebugger.CommandCenter = (function() {
  var parse_command = function(command, text, fun) {
    var match = new RegExp("^" + command + " " + "(.+)").exec(text);

    if (match === null) {
      return false;
    } else {
      return match[1];
    }
  };

  return {
    print: sys.print,
    puts:  sys.puts,
    stdio: process.stdio,
    commands: NodeDebugger.Commands,

    parse: function(text) {
      var puts     = this.puts,
          commands = this.commands,
          result   = false;

      result = parse_command("rw", text);

      if (result) {
        return [commands.raw_write, result];
      } else {
        puts("unknown command: " + text);
        return null;
      }
    },

    stdinListener: function(text) {
      var pair = this.parse(text);

      if (pair instanceof Array) {
        pair[0](pair[1]);
      }
    },

    prompt: function() {
      var print = this.print;
      print("ndb> ");
    },

    loop: function() {
      var stdio = this.stdio;

      this.commands.connection = this.connection;
      this.prompt();
      this.stdio.open();
      this.stdio.addListener("data", this.stdinListener);
    }
  };
})();