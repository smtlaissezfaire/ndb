var sys = require("sys"),
    tcp = require("tcp");

var nodeDebugger = function() {
  var ndb = {};

  ndb.version = "0.0.1";
  ndb.port    = 5858;
  ndb.verbose = false;

  ndb.Helpers = {
    puts:  sys.puts,
    print: sys.print,
    tcp:   tcp,
    stdio: process.stdio,

    log: function(str, repetition) {
      var lines = str.split("\n"),
          puts  = ndb.Helpers.puts,
          line,
          i;

      for (i = 0; i < lines.length; i++) {
        line = lines[i];
        puts(repetition + line);
      }
    },

    prompt: function() {
      var print = ndb.Helpers.print;
      print("ndb> ");
    },

    include: function(array, element) {
      return array.indexOf(element) !== -1;
    },

    commonParse: function(text) {
      var include = ndb.Helpers.include;

      if (include(this.commandNames, text)) {
        return [this];
      }
    }
  };

  ndb.start = function() {
    var tcp           = ndb.Helpers.tcp,
        puts          = ndb.Helpers.puts,
        commandCenter = this.commandCenter || Object.create(ndb.CommandCenter),
        eventListener = this.eventListener || Object.create(ndb.EventListener),
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

  ndb.Commands = {};
  ndb.Commands.List      = library_require("./commands/list",      ndb);
  ndb.Commands.RawWrite  = library_require("./commands/raw_write", ndb);
  ndb.Commands.Help      = library_require("./commands/help",      ndb);
  ndb.Commands.Break     = library_require("./commands/break",     ndb);
  ndb.Commands.Continue  = library_require("./commands/continue",  ndb);
  ndb.Commands.Next      = library_require("./commands/next",      ndb);
  ndb.Commands.Evaluate  = library_require("./commands/evaluate",  ndb);
  ndb.Commands.Quit      = library_require("./commands/quit",      ndb);
  ndb.Commands.Version   = library_require("./commands/version",   ndb);
  ndb.Commands.Verbose   = library_require("./commands/verbose",   ndb);
  ndb.Commands.Backtrace = library_require("./commands/backtrace", ndb);

  ndb.CommandCenter = (function() {
    var parse_command = function(command, text, fun) {
      var match = new RegExp("^" + command + " " + "(.+)").exec(text);

      if (match === null) {
        return false;
      } else {
        return match[1];
      }
    };

    return {
      commands: ndb.Commands,

      parse: function(text) {
        var puts     = ndb.Helpers.puts,
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
        var stdio = ndb.Helpers.stdio,
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

  ndb.EventListener = {
    verbose: true,

    prompt: ndb.Helpers.prompt,

    receive: function(str) {
      var puts    = ndb.Helpers.puts,
          prompt  = this.prompt,
          log     = ndb.Helpers.log,
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
          ndb.Commands.Break.output(json);
        } else if (json.command === "source") {
          ndb.Commands.List.output(json);
        } else if (json.command == "evaluate") {
          ndb.Commands.Evaluate.output(json);
        }
      } catch (_) {}

      this.prompt();
    }
  };

  return ndb;
}();

for (property in nodeDebugger) {
  if (nodeDebugger.hasOwnProperty(property)) {
    exports[property] = nodeDebugger[property];
  }
}
