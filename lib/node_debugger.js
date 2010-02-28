var ndb = (function() {
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
        commandCenter = this.commandCenter || Object.create(nodeDebugger.CommandCenter),
        eventListener = this.eventListener || Object.create(nodeDebugger.EventListener),
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

  function library_require(filename, object) {
    var mod = require(filename);
    mod.calling_module = object;
    return mod;
  }

  nodeDebugger.Commands = {};
  nodeDebugger.Commands.List     = library_require("./commands/list",      nodeDebugger);
  nodeDebugger.Commands.RawWrite = library_require("./commands/raw_write", nodeDebugger);
  nodeDebugger.Commands.Help     = library_require("./commands/help",      nodeDebugger);
  nodeDebugger.Commands.Break    = library_require("./commands/break",     nodeDebugger);

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
          return [commands.RawWrite, result];
        }

        if (text === "l" || text === "list") {
          return [commands.List];
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

      try {
        json = JSON.parse(json);
      } catch (_) {};

      if (json.event === "break") {
        nodeDebugger.Commands.Break.output(json);
      } else if (json.command === "source") {
        nodeDebugger.Commands.List.output(json);
      }
    }
  };

  return nodeDebugger;
})();

for (property in ndb) {
  if (ndb.hasOwnProperty(property)) {
    exports[property] = ndb[property];
  }
}