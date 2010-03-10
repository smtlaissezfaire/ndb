var sys = require("sys"),
    tcp = require("tcp");

var ndb = function() {
  var nodeDebugger = {};

  nodeDebugger.version = "0.0.1";
  nodeDebugger.port    = 5858;
  nodeDebugger.verbose = false;

  nodeDebugger.Helpers = {
    puts:  sys.puts,
    print: sys.print,
    tcp:   tcp,
    stdio: process.stdio,
    log: function(str, repetition) {
      var lines = str.split("\n"),
          puts  = nodeDebugger.Helpers.puts,
          line,
          i;

      for (i = 0; i < lines.length; i++) {
        line = lines[i];
        puts(repetition + line);
      }
    },
    prompt: function() {
      var print = nodeDebugger.Helpers.print;
      print("ndb> ");
    }
  };

  nodeDebugger.start = function() {
    var tcp           = nodeDebugger.Helpers.tcp,
        puts          = nodeDebugger.Helpers.puts,
        commandCenter = this.commandCenter || Object.create(nodeDebugger.CommandCenter),
        eventListener = this.eventListener || Object.create(nodeDebugger.EventListener),
        connection;

    connection = tcp.createConnection(this.port);
    connection.setEncoding("ascii");

    connection.addListener("data", function() {
      eventListener.receive.apply(eventListener, arguments);
    });

    // set some defaults
    eventListener.verbose = this.verbose;
    commandCenter.connection = connection;

    // start the main repl loop
    puts("welcome to the node debugger!");
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
  nodeDebugger.Commands.Continue = library_require("./commands/continue",  nodeDebugger);
  nodeDebugger.Commands.Next     = library_require("./commands/next",      nodeDebugger);
  nodeDebugger.Commands.Evaluate = library_require("./commands/evaluate",  nodeDebugger);
  nodeDebugger.Commands.Quit     = library_require("./commands/quit",      nodeDebugger);
  nodeDebugger.Commands.Version  = library_require("./commands/version",   nodeDebugger);
  nodeDebugger.Commands.Verbose  = library_require("./commands/verbose",   nodeDebugger);

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
            result   = false,
            command,
            i;

        text = text.trim();

        for (i in this.commands) {
          command = commands[i];

          if (command.parse) {
            result = command.parse(text);
            if (result) {
              return result;
            }
          }
        }

        return [commands.Help];
      },

      stdinListener: function(text) {
        var pair = this.parse(text);

        if (pair instanceof Array) {
          pair[0].run(pair[1]);
        }
      },

      loop: function() {
        var stdio = nodeDebugger.Helpers.stdio,
            prompt = this.prompt,
            listener;

        this.commands.connection = this.connection;
        stdio.open();

        var self = this;

        stdio.addListener("data", function() {
          self.stdinListener.apply(self, arguments);
        });
      }
    };
  })();

  nodeDebugger.EventListener = {
    verbose: true,

    prompt: nodeDebugger.Helpers.prompt,

    receive: function(str) {
      var puts    = nodeDebugger.Helpers.puts,
          prompt  = this.prompt,
          log     = nodeDebugger.Helpers.log,
          verbose = this.verbose,
          regexp,
          json;

      if (verbose) {
        log(str, "verbose: <<< ");
      }

      try {
        regexp = new RegExp("Content-Length: \\d+\r\n\r\n");
        json = JSON.parse(str.replace(regexp, ""));

        if (json.event === "break") {
          nodeDebugger.Commands.Break.output(json);
        } else if (json.command === "source") {
          nodeDebugger.Commands.List.output(json);
        } else if (json.command == "evaluate") {
          nodeDebugger.Commands.Evaluate.output(json);
        }
      } catch (_) {}

      this.prompt();
    }
  };

  return nodeDebugger;
}();

for (property in ndb) {
  if (ndb.hasOwnProperty(property)) {
    exports[property] = ndb[property];
  }
}