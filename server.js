const fs = require('fs');
const express = require('express');
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

function getFiles(dir){
    fileList = [];
 
    var files = fs.readdirSync(dir);
    for(var i in files){
        if (!files.hasOwnProperty(i)) continue;
        file = [];
        var name = files[i];	file.push(name);
        var addr = '/resources/audio/' + files[i];	file.push(addr);
        var fname = dir + '/' + files[i];
        if (!fs.statSync(fname).isDirectory()){
            fileList.push(file);
        }
    }
    fileList.sort();
    return fileList;
}

control_app.use(express.static(__dirname + '/'));
user_app.use(express.static(__dirname + '/'));

control_app.get('/', function(req, res){
	res.sendFile(__dirname + '/control.html');
});

user_app.get('/', function(req, res){
	res.sendFile(__dirname + '/user.html');
});

control_app.use('/timesync', timesyncServer.requestHandler);
user_app.use('/timesync', timesyncServer.requestHandler);

var getIP = myip.getLocalIP4();
var ip = 'http://'+ getIP + ':3000';
var cnt=0;
// var readyCnt=0;

setInterval(function(){
	control_io.emit('user',cnt);
},5000);

flist=getFiles(__dirname + '/resources/audio');

user_io.on('connection',function(socket){
	//console.log('hello');
	cnt+=1;
	
	console.log('user connected');
	user_io.emit('flist',flist);

	/*socket.on('ready',function(){
		control_io.emit('ready');
	});*/

	socket.on('disconnect',function(){
		console.log('user bye');
		cnt-=1;
	});
});

control_io.on('connection', function(socket){

	// control_io.emit('ip',ip);

	console.log('server connected');
	control_io.emit('flist',flist);

	socket.on('play', function(msg){
		user_io.emit('play',msg);
	});

	socket.on('sync',function(msg){
		user_io.emit('sync',msg);
	});

	socket.on('change',function(msg){
		user_io.emit('change',msg);
	});

	socket.on('disconnect',function(){
		console.log('server bye');
	});

});

control_server.listen(1234);
user_server.listen(3000);
console.log('HTTP Servers listening on -\nController - ' + getIP + ':1234\nUser - ' + getIP + ':3000')