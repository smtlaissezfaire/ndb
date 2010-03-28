
# ndb - the node debugger

A command line node.js/v8 debugger.  It still in alpha;
don't expect all of your favorite debugger commands to
work quite as expected.

## Usage:

### Starting it up:

    $ node --debug-brk my_js.js
    debugger listening on port 5858
    Waiting for remote debugger connection...

    $ ./bin/ndb

### An example session:

    hopcroft:ndb(master) scotttaylor$ ./bin/ndb
    welcome to the node debugger!
    ndb> ndb> list
       1 (function (process) {
       2
       3 process.global.process = process;
       4 process.global.global = process.global;
       5 global.GLOBAL = global;
       6
       7 /** deprecation errors ************************************************/
       8
       9 function removed (reason) {
    ndb> Breakpoint at 1:10 (in function undefined)
    (function (exports, require, module, __filename, __dirname) { var sys = require("sys"),
    ndb> list
    => 1 (function (exports, require, module, __filename, __dirname) { var sys = require("sys"),
       2     tcp = require("tcp");
       3
       4 var ndb = exports;
       5
       6 ndb.version = "0.1.0";
       7
       8 ndb.reset = function() {
       9   this.port    = 5858;
    ndb> break 5
    ndb> continue
    ndb> ndb> Breakpoint at 6:12 (in function undefined - breakpoints: [1])
    ndb.version = "0.1.0";
    ndb> list
       2     tcp = require("tcp");
       3
       4 var ndb = exports;
       5
    => 6 ndb.version = "0.1.0";
       7
       8 ndb.reset = function() {
       9   this.port    = 5858;
       10   this.verbose = false;
    ndb> e ndb
    => {}
    ndb> n
    ndb> ndb> Breakpoint at 8:10 (in function undefined)
    ndb.reset = function() {
    ndb> list
       4 var ndb = exports;
       5
       6 ndb.version = "0.1.0";
       7
    => 8 ndb.reset = function() {
       9   this.port    = 5858;
       10   this.verbose = false;
       11
       12   this.State.reset();
    ndb> e ndb
    => { version: '0.1.0' }
    ndb> help
    b, break
    bt, backtrace
    c, continue
    e, eval, p, print
    h, help
    l, list
    n, next
    quit
    rw
    verbose
    version
    ndb> quit
    bye!


## Running Unit tests:

    git submodule update --init
    node spec/node.js

## Node version:

ndb's specs run against node v0.1.33

## License

    ndb - the node.js command line debugger
    Copyright (C) 2010  Scott Taylor <scott@railsnewbie.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
