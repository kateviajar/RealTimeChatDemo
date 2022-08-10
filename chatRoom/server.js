const path = require('path');
const http = require('http');
const express = require('express');
// import socket.io
const socketio = require('socket.io');
// import formatMessage
const formatMessage = require('./utils/messages');
// import functions from users.js
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
// create a server
const server = http.createServer(app);
// Initialize the socketio object
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public'))); // for public folder
// set a variable
const botName = 'Chat Bot';

/** Socket.io connection */
// Run when client connects
io.on('connection', socket => {
  // Get username and room from client
  socket.on('joinRoom', ({ username, room }) => {
    // user join the room
    const user = userJoin(socket.id, username, room); // add user in the memory

    socket.join(user.room);

    console.log('New WebSocket Connection ...');
    // instead of sending message string, we send a message object by using formatMessage()
    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcom to Chat!')); 
  
    // modify broadcast for a specific room; add username to the message
    // Broadcast when a user connects, it informs everyone except the user self
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Broadcast to everyone
  // io.emit();

  // Listen for charMessage from client
  socket.on('chatMessage', (msg) => {
    // get current user
    const user = getCurrentUser(socket.id);
    // emit message to everyone
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    // get which user leaves the room
    const user = userLeave(socket.id);

    if (user) {
      // to emit everyone a message
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
    }

    // send users and room to client when someone left
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });
});

// set up PORT number
const PORT = 3000; 

// run the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));