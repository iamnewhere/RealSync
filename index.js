const express =  require('express');
const http = require('http');
const socket_io = require('socket.io');
const timesyncServer = require('timesync/server');
const myip = require('quick-local-ip');

var control_app = express();
var control_server = http.Server(control_app);
var control_io = socket_io(control_server);

var user_app = express();
var user_server = http.Server(user_app);
var user_io = socket_io(user_server);

control_app.use(express.static('/'));
user_app.use(express.static('/'));

control_app.get('/', function(req, res){
	res.sendFile('/home/pineapple/hackfest/control.html');
});

user_app.get('/', function(req, res){
	res.sendFile('/home/pineapple/hackfest/index.html');
});

control_app.use('/timesync', timesyncServer.requestHandler);
user_app.use('/timesync', timesyncServer.requestHandler);

var ip = 'http://'+ myip.getLocalIP4() + ':1234';
var cnt=0;
// var readyCnt=0;

user_io.on('connection',function(socket){
	//console.log('hello');
	cnt=cnt+1;
	control_io.emit('user',cnt);

	/*socket.on('ready',function(){
		control_io.emit('ready');
	});*/

	socket.on('disconnect',function(){
		// console.log('bye');
		cnt-=1;
		control_io.emit('user',cnt);
	});
});

control_io.on('connection', function(socket){

	control_io.emit('ip',ip);

	socket.on('play', function(msg){
		user_io.emit('play',msg);
	});

	socket.on('sync',function(msg){
		user_io.emit('sync',msg);
	});

	socket.on('change',function(msg){
		user_io.emit('change',msg);
	});

});

control_server.listen(1234);
user_server.listen(3000);
console.log('HTTP Servers listening on ports -\nController - *:1234\nUser - *:3000')