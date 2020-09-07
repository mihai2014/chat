var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

/*
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});
*/

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


// This will emit the event to all connected sockets
//io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); 

/*
    Object.keys(users).forEach(function(key) {
       console.log(key + " " + users[key]);
    }); 
*/


var users = {};

function get_name(id){
  if(users[id]!="") return users[id];
  return id;
}


io.on('connection', (socket) => {
  socket.on('name', (name) => {
    users[socket.id] = name;
    console.log('received name:', name)	  
  });	  
});	


io.on('connection', (socket) => {
  users[socket.id] = "";
  io.emit('get_name', "get names"); //seems not working (at restart server)!?	
  console.log('user connected ',get_name(socket.id));
  io.emit('msg', get_name(socket.id) + " connected");	
  io.to(socket.id).emit("msg", "welcome!");
  var keys = Object.keys(users);
  console.log('users on-line: ' + keys);  	
  socket.on('disconnect', () => {
    console.log('user disconnected ',get_name(socket.id));
    io.emit('msg', socket.id + " disconnected");
    delete users[socket.id];
    var keys = Object.keys(users);
    console.log('users on-line: ' + keys);	  
  });
});

io.on('connection', (socket) => {
  socket.on('msg', (msg) => {
    console.log(get_name(socket.id) +': message: ' + msg);
  });
});

io.on('connection', (socket) => {
  socket.on('msg', (msg) => {
    /*emit to all, including sender*/	  
    //io.emit('msg', get_name(socket.id) + ":" + msg);

    /*exclude sender, send message only to receivers*/ 
    var keys = Object.keys(users);
    //console.log(keys,keys.length)	  
    var n = 0;	  
    while(n < keys.length){
      var sock_id = keys[n];
      if(sock_id != socket.id){ 
	//console.log('>',sock_id);
	//      receivers                       sender
        io.to(sock_id).emit("msg", get_name(socket.id) + ":" + msg);
      }	   
      n++;	    
    } 
  });
});


http.listen(3000, () => {
  console.log('listening on *:3000');
});
