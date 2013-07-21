
var express = require('express');

var app = express.createServer(express.logger());

var fs = require('fs'),
    buf = fs.readFileSync('index.html')
            .toString('utf-8');

app.get('/', function(request, response) {
  response.send(buf);
});



var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
