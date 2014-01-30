var express = require('express');
var http = require('http');
var path = require('path');
var socket = require('socket.io')
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//routes

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//websocket stuff
var io = socket.listen(server);

io.sockets.on('connection',function (socket) {
	
	socket.emit('welcome',{message: 'welcome'});

	socket.on('status',function (state) {
		
	});

	socket.on('update',function (message) {
		io.sockets.emit('chat',message);
	});
});