exports.run = function() {
  this.calling_module.Helpers.puts("bye!");
  process.exit();
};

exports.parse = function(text) {
  if (text === "quit") {
    return [this];
  }
};