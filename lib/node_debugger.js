var sys = require("sys"),
    tcp = require("tcp");

NodeDebugger = {
  print: sys.printf,
  puts:  sys.puts,
  tcp:   tcp,
  port:  5858,

  start: function() {
    var tcp   = this.tcp,
        puts  = this.puts,
        print = this.print;

    puts("welcome to the node debugger!");

    tcp.createConnection(this.port);
    tcp.setEncoding("ascii");

    print("ndb> ");
  },

  Commands: {
    connection: null,
    raw_write: function(json) {
      var content_length = json.length;

      connection.write("Content-Length: " + content_length + "\r\n\r\n" + json + "\n");
    }
  }
};