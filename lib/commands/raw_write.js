exports.run = function(json) {
  if (typeof(json) != "string") {
    json = JSON.stringify(json);
  }

  var data       = json + "\n",
      header     = "Content-Length: " + data.length + "\r\n\r\n",
      connection = this.calling_module.Commands.connection;

  connection.write(header + data);
};
