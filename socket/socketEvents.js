let socket_event = null;
let io_event = null;
let socket_controller = require('../controllers/socket-controller');

module.exports.getSocket = () => {
  // console.log(socket_event,'     getSocket in socketEvents');
  return socket_event;
}

module.exports.getIo = () => {
  // console.log(io_event,'     io_event in socketEvents');
  return io_event;
}

module.exports.createSocket = (io) => {
  try {
    // console.log(io, 'io in socketEvents, Socket created');
    io.on('connection', (socket) => {
      console.log('New user connected');

      // socket.broadcast.emit("broadcast_event_1", "broadcast_message_1");
    
      socket.emit("event_name_1", "event_message_1");

      socket.join("room_1");
      io.to("room_1").emit("room_event_1");

      socket.on('chat_message', (msg, callback) => {
        io.emit('chat_message', msg);
        callback({
          status: "ok"
        });
      });
    
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });


      /** Chat code separate */
      socket.on('join',(data)=>{
        socket.join(data.room);
        console.log(`${data.userName} joined the room: ${data.room}`);
        socket.broadcast.to(data.room).emit('new user joined',{userId: data.userId, userName: data.userName, message: 'has joined the room'});
      });
      socket.on('leave',(data)=>{
        socket.leave(data.room);
       console.log(`${data.userName} leave the room: ${data.room}`);
        socket.broadcast.to(data.room).emit('left room',{userId: data.userId, userName: data.userName, message: 'left the room'});
      });
      socket.on('message',data => {
       console.log(data, 'msg');
        io.in(data.room).emit('new message',{userId: data.userId, userName: data.userName, message: data.message});
      });


      io_event = io;
      socket_event = socket;
    });
  } catch (err) {
    console.log(err, "Error occur in socket");
  }
}
