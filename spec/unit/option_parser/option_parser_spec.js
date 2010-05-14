describe("Option Parsing", function() {
  describe("version", function() {
    before_each(function() {
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
    });
  });
});