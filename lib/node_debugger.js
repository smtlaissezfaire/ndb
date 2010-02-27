var NodeDebugger = (function() {
  var sys = require("sys"),
      tcp = require("tcp");

  var nodeDebugger = {};

  nodeDebugger.Helpers = {
    puts:  sys.puts,
    print: sys.print,
    tcp:   tcp,
    stdio: process.stdio
  };

  nodeDebugger.puts = nodeDebugger.Helpers.puts;
  nodeDebugger.tcp  = nodeDebugger.Helpers.tcp;
  nodeDebugger.port = 5858;

  nodeDebugger.start = function() {
    var tcp           = this.tcp,
        puts          = this.puts,
        commandCenter = this.commandCenter || Object.create(NodeDebugger.CommandCenter),
        eventListener = this.eventListener || Object.create(NodeDebugger.EventListener),
        connection;

    puts("welcome to the node debugger!");

    connection = tcp.createConnection(this.port);
    connection.setEncoding("ascii");

    var that = this;

    connection.addListener("data", function() {
      eventListener.receive.apply(eventListener, arguments);
    });

    commandCenter.connection = connection;
    commandCenter.loop();
  };

  nodeDebugger.Commands = {
    raw_write: function(json) {
      var data       = json + "\n",
          header     = "Content-Length: " + data.length + "\r\n\r\n",
          connection = this.connection;

      connection.write(header + data);
    }
  };

  nodeDebugger.CommandCenter = (function() {
    var parse_command = function(command, text, fun) {
      var match = new RegExp("^" + command + " " + "(.+)").exec(text);

      if (match === null) {
        return false;
      } else {
        return match[1];
      }
    };

    return {
      print:    nodeDebugger.Helpers.print,
      puts:     nodeDebugger.Helpers.puts,
      stdio:    nodeDebugger.Helpers.stdio,
      commands: nodeDebugger.Commands,

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
          pair[0].call(this.commands, pair[1]);
        }

        this.prompt();
      },

      prompt: function() {
        var print = this.print;
        print("ndb> ");
      },

      loop: function() {
        var stdio = this.stdio,
            listener;

        this.commands.connection = this.connection;
        this.prompt();
        this.stdio.open();

        var that = this;

        this.stdio.addListener("data", function() {
          that.stdinListener.apply(that, arguments);
        });
      }
    };
  })();

  nodeDebugger.EventListener = {
    verbose: true,
    puts: sys.puts,

    receive: function(json) {
      if (this.verbose) {
        this.puts("received: " + json);
      }
    }
  };

  return nodeDebugger;
})();

for (property in NodeDebugger) {
  if (NodeDebugger.hasOwnProperty(property)) {
    exports[property] = NodeDebugger[property];
  }
}