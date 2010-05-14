describe("Option Parsing", function() {
  describe("opts", function() {
    it("should have opts as the option parser", function() {
      var optionParser = ndb.OptionParser.opts;
      optionParser["parse"].should.not.be_null;
    });
  });

  describe("parsing and running", function() {
    it("should parse the options", function() {
      var option_parser = ndb.OptionParser;
      var internalOptParseLibrary = option_parser.opts;

      spy.stub(internalOptParseLibrary, "parse");

      spy.spyOn(internalOptParseLibrary, function() {
        option_parser.parse();

        spy.intercepted(internalOptParseLibrary, "parse", function(options, arguments, auto_generated_help) {
          options.should.equal(option_parser.options);
          arguments.should.equal(true);
          auto_generated_help.should.equal(true);
        });
      });
    });

    it("should call ndb.start()", function() {
      spy.spyOn(ndb, function() {
        ndb.OptionParser.parse();
        spy.intercepted(ndb, "start");
      });
    });
  });

  describe("version", function() {
    before_each(function() {
      spy.stub(ndb.Helpers, "exit");

      findShortOption = function(option_name) {
        var result = null;

        ndb.OptionParser.options.forEach(function(option) {
          if (option["short"] === option_name) {
            result = option;
          }
        });

        return result;
      };

      findLongOption = function(option_name) {
        var result = null;

        ndb.OptionParser.options.forEach(function(option) {
          if (option["long"] === option_name) {
            result = option;
          }
        });

        return result;
      };
    });

    describe("version", function() {
      it("should parse -v as version", function() {
        findShortOption("v").should.not.be_null;
      });

      it("should parse --version", function() {
        findLongOption("version").should.not.be_null;
      });

      it("should have a description", function() {
        findLongOption("version").description.should.equal("Print version and exit");
      });

      it("should print out the current version", function() {
        spy.spyOn(ndb.Helpers, function() {
          findLongOption("version").callback();

          spy.intercepted(ndb.Helpers, "puts", function(text) {
            text.should.equal("ndb version 0.1.2");
          });
        });
      });

      it("should exit after running", function() {
        spy.spyOn(ndb.Helpers, function() {
          findLongOption("version").callback();

          spy.intercepted(ndb.Helpers, "exit");
        });
      });
    });
  });
});