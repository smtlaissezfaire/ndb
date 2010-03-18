exports.commandNames = ["l", "list"];

exports.parse = function(text) {
  return this.calling_module.Helpers.commonParse.call(this, text);
};

exports.run = function() {
  var ndb    = this.calling_module,
      writer = ndb.Commands.RawWrite,
      lineNumber = ndb.State.lineNumber;

  if (!lineNumber) {
    lineNumber = 1;
  }

  lineNumber -= 1;

  writer.run({
    type:    "request",
    command: "source",
    arguments: {
      fromLine: lineNumber,
      toLine:   lineNumber + 5
    }
  });
};

function fromTo(start, end, fun) {
  var index   = 0,
      current = start;

  for (; current < end; current++, index++) {
    fun(current, index);
  }
}

function constructString(obj, current_line) {
  var source    = obj.body.source.split("\n"),
      fromLine  = obj.body.fromLine + 1,
      toLine    = obj.body.toLine + 1,
      str       = "";

  fromTo(fromLine, toLine, function(sourceNum, counter) {
    if (sourceNum === current_line) {
      str += "=> ";
    } else {
      str += "   ";
    }

    str += sourceNum + " " + source[counter] + "\n";
  });

  return str;
}

exports.output = function(obj) {
  var ndb  = this.calling_module,
      puts = ndb.Helpers.puts;

  puts(constructString(obj, ndb.State.lineNumber));
};

