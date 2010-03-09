exports.text = "                                            \n\
help                                                        \n\
                                                            \n\
commands:                                                   \n\
                                                            \n\
  l / list             - list the current code              \n\
  n / next [stepcount] - next line of code                  \n\
  h / help             - this help                          \n\
  e / evaluate <expr>  - evaluate the expression expr       \n\
  rw <json>            - send raw (\"raw write\") json text \n\
  v / version          - display the version                \n\
  q / quit             - quit                               \n\
";

exports.run = function() {
  var ndb = this.calling_module,
      puts = ndb.Helpers.puts;

  puts(this.text);
  ndb.EventListener.prompt();
};
