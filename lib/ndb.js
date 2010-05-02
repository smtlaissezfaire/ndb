var sys = require("sys"),
    tcp = require("net");

var ndb = exports;

ndb.version = "0.1.3";

ndb.reset = function() {
  this.port    = 5858;
  this.verbose = false;

  this.State.reset();
  this.EventListener.reset();
  this.CommandCenter.reset();
  this.Commands.List.reset();
};

ndb.Helpers = {
  puts:    sys.puts,
  print:   sys.print,
  tcp:     tcp,
  process: process,
  exit:    process.exit,

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
  },

  opts: require("./vendor/js-opts/opts")
};

ndb.start = function() {
  var tcp           = ndb.Helpers.tcp,
      puts          = ndb.Helpers.puts,
      prompt        = ndb.Helpers.prompt,
      commandCenter = this.commandCenter || Object.create(ndb.CommandCenter),
      eventListener = this.eventListener || Object.create(ndb.EventListener),
      connection;

  connection = tcp.createConnection(this.port);
  connection.setEncoding("ascii");

  connection.addListener("data", function() {
    eventListener.receive.apply(eventListener, arguments);
  });

  connection.addListener("end", ndb.Helpers.exit);

  // set some defaults
  eventListener.verbose = this.verbose;
  commandCenter.connection = connection;

  // start the main repl loop
  puts("welcome to the node debugger!");
  prompt();
  commandCenter.loop();
};

function library_require(filename, object) {
  var mod = require(filename);
  mod.calling_module = object;
  return mod;
}

ndb.Commands = {};
ndb.Commands.List          = library_require("./commands/list",          ndb);
ndb.Commands.RawWrite      = library_require("./commands/raw_write",     ndb);
ndb.Commands.Help          = library_require("./commands/help",          ndb);
ndb.Commands.SetBreakpoint = library_require("./commands/setbreakpoint", ndb);
ndb.Commands.Break         = library_require("./commands/break",         ndb);
ndb.Commands.Continue      = library_require("./commands/continue",      ndb);
ndb.Commands.Next          = library_require("./commands/next",          ndb);
ndb.Commands.Evaluate      = library_require("./commands/evaluate",      ndb);
ndb.Commands.Quit          = library_require("./commands/quit",          ndb);
ndb.Commands.Version       = library_require("./commands/version",       ndb);
ndb.Commands.Verbose       = library_require("./commands/verbose",       ndb);
ndb.Commands.Backtrace     = library_require("./commands/backtrace",     ndb);
ndb.Commands.StepIn        = library_require("./commands/step_in",       ndb);

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
    reset: function() {
      this.lastCommand = null;
    },

    commands: ndb.Commands,

    parse: function(text) {
      var puts     = ndb.Helpers.puts,
          commands = this.commands,
          result   = false,
          command,
          i;

      text = text.trim();

      if (text === "" && this.lastCommand) {
        return this.lastCommand;
      }

      for (i in this.commands) {
        command = commands[i];

        if (command.parseCommand) {
          result = command.parseCommand(text);
          if (result) {
            this.lastCommand = result;
            return result;
          }
        }
      }

      this.lastCommand = null;

      return [commands.Help];
    },

    stdinListener: function(text) {
      var pair = this.parse(text);

      if (pair instanceof Array) {
        pair[0].run(pair[1]);
      }
    },

    loop: function() {
      var process = ndb.Helpers.process,
          prompt  = this.prompt,
          stdin,
          listener;

      this.commands.connection = this.connection;
      stdin = process.openStdin();
      stdin.setEncoding("ascii");

      var self = this;

      stdin.addListener("data", function() {
        self.stdinListener.apply(self, arguments);
      });
    }
  };
})();

ndb.EventListener = {
  reset: function() {
    this.buffer = "";
  },

  regexp: new RegExp("Content-Length: \\d+\r\n\r\n"),

  receive: function(str, __json_callback) {
    var puts    = ndb.Helpers.puts,
        log     = ndb.Helpers.log,
        prompt  = ndb.Helpers.prompt,
        verbose = ndb.verbose,
        regexp  = this.regexp,
        message,
        message_body,
        content_length,
        json,
        result,
        object,
        i;

    if (verbose) {
      log(str, "verbose: <<< ");
    }

    this.buffer += str;

    do {
      message        = ndb.MessageParser.parse(this.buffer);
      content_length = message.headers["Content-Length"];

      if (content_length && message.body.length >= parseInt(content_length, "10")) {
        message_body = message.body.substr(0, content_length);

        if (content_length > 0) {
          try {
            json = JSON.parse(message_body);

            if (__json_callback) {
              __json_callback(json);
            }

            for (i in ndb.Commands) {
              object = ndb.Commands[i];

              if (object.parseResponse) {
                result = object.parseResponse(json);

                if (result) {
                  result.output(json);
                  prompt();
                }
              }
            }
          } catch (e) {
            sys.puts("");
            sys.puts("");
            sys.puts("ERROR: "          + sys.inspect(e));
            sys.puts("BUFFER: "         + this.buffer);
            sys.puts("content length: " + content_length);
            sys.puts("message body: "   + message_body);
            sys.puts("");
            sys.puts("");
            sys.puts("");
          }
        }

        this.buffer = this.buffer.replace(message.raw_headers + "\r\n" + message_body, "");
      } else {
        break;
      }
    } while (true)
  }
};

ndb.MessageParser = {
  parse: function(text) {
    var lines             = text.split("\r\n"),
        done_with_headers = false,
        header,
        value,
        i;

    var obj = {
      headers: {},
      body: "",
      raw_headers: ""
    };

    lines.forEach(function(line) {
      if (done_with_headers === true) {
        obj.body += line;
      } else if (line === "") {
        done_with_headers = true;
      } else {
        i = line.indexOf(":");
        header = line.slice(0, i);
        value = line.slice(i+1, line.length).trimLeft();

        obj.raw_headers += line + "\r\n";
        obj.headers[header] = value;
      }
    });

    return obj;
  }
};

ndb.OptionParser = {
  options: [
    {
      "short": "v",
      "long": "version",
      description: "Print version and exit",
      callback: function() {
        ndb.Helpers.puts("ndb version 0.1.2");
      }
    }
  ]
};

ndb.State = {
  reset: function() {
    this.filename   = null;
    this.lineNumber = null;
  }
};

ndb.reset();