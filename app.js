var express = require('express');
var http = require('http');
var path = require('path');
var socket = require('socket.io')
var app = express();
var fs = require('fs');
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
var userCounter = 0;
var users = {};
var userNames = {};
var modules = goGetEm('collaborations');
io.sockets.on('connection',function (socket) {

	socket.on('keypress',function (message) {
		message.user = socket.user;
		socket.broadcast.emit('keypress',message);	
	});

	socket.on('update',function (message) {
		filterize(modules,message.message,io);		
	});
	socket.on('name',function (message) {
		userCounter++;
		socket.user = userCounter;
		socket.name = message.message;
		userNames[socket.user] = socket.name;
		socket.emit('welcome',{message: 'welcome', user: userCounter, users: users, userNames: userNames});
		users[socket.user] = true; //store data maybe?
		socket.broadcast.emit('newChatter',{
			user: userCounter,
			name: message.message
		})
	});
	socket.on('disconnect',function (message){
		io.sockets.emit('lostAChatter',{user: socket.user})
		delete users[socket.user];
		delete userNames[socket.user];
	});
});

function filterize(modules,message,io) {
	for (var module in modules) {
		try {
			var result = modules[module].filter(message);
			if (result) io.sockets.emit('chat',{'message':result});
		} catch(e) {
			console.log("somebody's stuff blew up");
		}
	}
}

function goGetEm(path) {
	var files = fs.readdirSync(path);
	var modules = [];
	for (var file in files) {
		try{
			modules.push(require('./'+path+'/'+files[file]));
		} catch(e) {
			console.log('somebodies crap bombed',e);
		}
	}
	return modules;
}