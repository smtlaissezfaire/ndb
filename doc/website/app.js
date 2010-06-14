require.paths.unshift(__dirname + "/dependencies/express/lib");
require.paths.unshift(__dirname + "/dependencies/jm/lib");

var jm = require("jm");
require("express");

var render = function(caller, yield) {
  caller.contentType("html");

  var headerNav = function(b, links) {
    b.ul(function() {
      links.forEach(function(link) {
        b.li(function() {
          b.a({href: link.url}, function() {
            b.text(link.title);
          });
        });
      });
    });
  };

  return jm.render(function(builder) {
    with(builder) {
      text('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">');

      html({"xmlns": "http://www.w3.org/1999/xhtml", "xml:lang": "en", "lang": "en"}, function() {
        head(function() {
          meta({"http-equiv": "Content-Type", "content": "text/html; charset=utf-8"});
          title("ndb - the node debugger");
        });

        body(function() {
          h1("ndb");

          headerNav(builder, [
            {title: "home",            url: "/"},
            {title: "docs",            url: "/docs"},
            {title: "bugs / issues",   url: "http://github.com/smtlaissezfaire/ndb/issues"},
            {title: "source (github)", url: "http://github.com/smtlaissezfaire/ndb"}
          ]);

          yield(builder);
        });
      });
    }
  });
};

var joinLines = function(lines) {
  return lines.join("\n");
};

get("/", function() {
  return render(this, function(b) {
    with(b) {
      h2("ndb - the node.js debugger");
        p("A command line node.js/v8 debugger.  It is still in beta, but perfectly usable.");

      h2("Usage");
        p("Starting it up:");
        pre(joinLines([
          "$ node --debug-brk my_js.js &",
          "debugger listening on port 5858",
          "Waiting for remote debugger connection...",
          "",
          "$ ./bin/ndb"
        ]));

        p("A convenience method that does the same thing:");
        pre("$ ./bin/ndb --local my_js.js");

        p("If you are running a server, you'll probably want to insert a debug " +
          "statement in your code, and start the debugger like so:");
        pre(joinLines([
          "$ node --debug my_js.js &",
          "$ ./bin/ndb"
        ]));

        p("See --help for more command options.");

      h2("An example session:");

        pre(joinLines([
          "hopcroft:ndb(master) scotttaylor$ ./bin/ndb                                                                           ",
          "welcome to the node debugger!                                                                                         ",
          "ndb> list                                                                                                             ",
          "   1 (function (process) {                                                                                            ",
          "   2                                                                                                                  ",
          "   3 process.global.process = process;                                                                                ",
          "   4 process.global.global = process.global;                                                                          ",
          "   5 global.GLOBAL = global;                                                                                          ",
          "   6                                                                                                                  ",
          "   7 /** deprecation errors ************************************************/                                         ",
          "   8                                                                                                                  ",
          "   9 function removed (reason) {                                                                                      ",
          "ndb> Breakpoint at 1:10 (in function undefined)                                                                       ",
          "(function (exports, require, module, __filename, __dirname) { require(\"./jspec_dot_reporter/jspec_dot_reporter\");   ",
          "ndb> continue                                                                                                         ",
          "Breakpoint at 2:8 (in function undefined)                                                                             ",
          "        debugger;                                                                                                     ",
          "ndb> list                                                                                                             ",
          "   1                                                                                                                  ",
          "=> 2         debugger;                                                                                                ",
          "   3         var result = grammar.parse([                                                                             ",
          "   4           [1, \"_\"]                                                                                             ",
          "   5         ]);                                                                                                      ",
          "   6                                                                                                                  ",
          "   7          expect(result).should(be_true)                                                                          ",
          "   8                                                                                                                  ",
          "ndb> next                                                                                                             ",
          "Breakpoint at 3:29 (in function undefined)                                                                            ",
          "        var result = grammar.parse([                                                                                  ",
          "ndb> list                                                                                                             ",
          "   1                                                                                                                  ",
          "   2         debugger;                                                                                                ",
          "=> 3         var result = grammar.parse([                                                                             ",
          "   4           [1, \"_\"]                                                                                             ",
          "   5         ]);                                                                                                      ",
          "   6                                                                                                                  ",
          "   7          expect(result).should(be_true)                                                                          ",
          "   8                                                                                                                  ",
          "ndb> e grammar.parse([[1, \"_\"]])                                                                                    ",
          "RangeError: Maximum call stack size exceeded                                                                          ",
          "ndb> list                                                                                                             ",
          "   1                                                                                                                  ",
          "   2         debugger;                                                                                                ",
          "=> 3         var result = grammar.parse([                                                                             ",
          "   4           [1, \"_\"]                                                                                             ",
          "   5         ]);                                                                                                      ",
          "   6                                                                                                                  ",
          "   7          expect(result).should(be_true)                                                                          ",
          "   8                                                                                                                  ",
          "ndb> step                                                                                                             ",
          "Breakpoint at 98:13 (in function undefined)                                                                           ",
          "      return parseRule(startRule);                                                                                    ",
          "ndb> list                                                                                                             ",
          "   94   var obj = {                                                                                                   ",
          "   95     parse: function(tokens) {                                                                                   ",
          "   96       token_index = 0;                                                                                          ",
          "   97       tokensGiven = tokens;                                                                                     ",
          "=> 98       return parseRule(startRule);                                                                              ",
          "   99     }                                                                                                           ",
          "   100   };                                                                                                           ",
          "   101                                                                                                                ",
          "   102   obj.__defineSetter__(\"rules\",     function(val) { rules = val;     });                                     ",
          "ndb> e startRule                                                                                                      ",
          "=> 'rule1'                                                                                                            ",
          "ndb> e parseRule                                                                                                      ",
          "=> [Function]                                                                                                         ",
          "ndb> step                                                                                                             ",
          "Breakpoint at 60:4 (in function undefined)                                                                            ",
          "    var rule_body = rules[name],                                                                                      ",
          "ndb> list                                                                                                             ",
          "   56     return return_value;                                                                                        ",
          "   57   };                                                                                                            ",
          "   58                                                                                                                 ",
          "   59   var parseRule = function(name) {                                                                              ",
          "=> 60     var rule_body = rules[name],                                                                                ",
          "   61         return_value,                                                                                           ",
          "   62         fun;                                                                                                    ",
          "   63                                                                                                                 ",
          "   64     if (rule_body instanceof Array) {                                                                           ",
          "ndb> next                                                                                                             ",
          "Breakpoint at 64:4 (in function undefined)                                                                            ",
          "    if (rule_body instanceof Array) {                                                                                 ",
          "ndb>                                                                                                                  ",
          "Breakpoint at 65:33 (in function undefined)                                                                           ",
          "      var namePrefix = rule_body.shift(1);                                                                            ",
          "ndb> list                                                                                                             ",
          "   61         return_value,                                                                                           ",
          "   62         fun;                                                                                                    ",
          "   63                                                                                                                 ",
          "   64     if (rule_body instanceof Array) {                                                                           ",
          "=> 65       var namePrefix = rule_body.shift(1);                                                                      ",
          "   66       fun = eval(\"parse\" + namePrefix);                                                                       ",
          "   67       components = rule_body;                                                                                   ",
          "   68     } else {                                                                                                    ",
          "   69       fun = parseNode;                                                                                          ",
          "ndb> help                                                                                                             ",
          "b, break                                                                                                              ",
          "bt, backtrace                                                                                                         ",
          "c, continue                                                                                                           ",
          "e, eval, p, print                                                                                                     ",
          "h, help                                                                                                               ",
          "l, list                                                                                                               ",
          "n, next                                                                                                               ",
          "quit                                                                                                                  ",
          "rw                                                                                                                    ",
          "s, step, stepin                                                                                                       ",
          "verbose                                                                                                               ",
          "version                                                                                                               ",
          "ndb> quit                                                                                                             ",
          "bye!                                                                                                                  "
      ]));

      //
      // ## Running Unit tests:
      //
      //     git submodule update --init
      //     make test
      //
      // ## Node version:
      //
      // Check the node compatibility page:
      //
      // http://wiki.github.com/ry/node/library-compatibility
      //
      // ## Questions, bugs, patches:
      //
      // Post it to the mailing list:
      //
      // http://groups.google.com/group/nodejsdebugger
      //
      // ## License
      //
      //     ndb - the node.js command line debugger
      //     Copyright (C) 2010  Scott Taylor <scott@railsnewbie.com>
      //
      //     This program is free software: you can redistribute it and/or modify
      //     it under the terms of the GNU General Public License as published by
      //     the Free Software Foundation, either version 3 of the License, or
      //     (at your option) any later version.
      //
      //     This program is distributed in the hope that it will be useful,
      //     but WITHOUT ANY WARRANTY; without even the implied warranty of
      //     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
      //     GNU General Public License for more details.
      //
      //     You should have received a copy of the GNU General Public License
      //     along with this program.  If not, see <http://www.gnu.org/licenses/>.

    }
  });
});

run();