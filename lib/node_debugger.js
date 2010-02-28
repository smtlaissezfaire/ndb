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

  nodeDebugger.port = 5858;

  nodeDebugger.start = function() {
    var tcp           = nodeDebugger.Helpers.tcp,
        puts          = nodeDebugger.Helpers.puts,
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

  nodeDebugger.Commands = {};
  nodeDebugger.Commands.raw_write = {
    run: function(json) {
      var data       = json + "\n",
          header     = "Content-Length: " + data.length + "\r\n\r\n",
          connection = nodeDebugger.Commands.connection;

      connection.write(header + data);
    }
  };

  nodeDebugger.Commands.Help = {
    text: "                                        \n\
help                                               \n\
                                                   \n\
  commands:                                        \n\
                                                   \n\
    h / help - this help                           \n\
    rw <json> - send raw (\"raw write\") json text \n\
    ",
    run: function() {
      var puts = nodeDebugger.Helpers.puts;
      puts(this.text);
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
      commands: nodeDebugger.Commands,

      parse: function(text) {
        var puts     = nodeDebugger.Helpers.puts,
            commands = this.commands,
            result   = false;

        text = text.trim();


        result = parse_command("rw", text);
        if (result) {
          return [commands.raw_write, result];
        }

        return [commands.Help];
      },

      stdinListener: function(text) {
        var pair = this.parse(text);

        if (pair instanceof Array) {
          pair[0].run(pair[1]);
        }

        this.prompt();
      },

      prompt: function() {
        var print = nodeDebugger.Helpers.print;

        print("ndb> ");
      },

      loop: function() {
        var stdio = nodeDebugger.Helpers.stdio,
            prompt = this.prompt,
            listener;

        this.commands.connection = this.connection;
        prompt();
        stdio.open();

        var that = this;

        stdio.addListener("data", function() {
          that.stdinListener.apply(that, arguments);
        });
      }
    };
  })();

  nodeDebugger.EventListener = {
    verbose: true,

    receive: function(json) {
      var puts = nodeDebugger.Helpers.puts;

      if (this.verbose) {
        puts("received: " + json);
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