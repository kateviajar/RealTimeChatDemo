
// initialising a new instance of express
const application = require('express')();

const server = require('http').createServer(application)

// Creating a new instance of Socket.io, and passing it our express instance
const io = require('socket.io')(server);

// Initialise the port, which the server should listen to.
const PORT = process.env.PORT || 3000
 
// Define a route / that will navigate to the index.html, representing the client-side of our application.
application.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});
 
// Start listening. Once the server starts listening, you can see the port number printed in the console
server.listen(PORT, () => {
   console.log('Server is running on port: ' + PORT);
});
 
// Set socket.io to start listening for connection events
io.on('connection', (socket) => {
 
    // Handle a disconnect event for each socket which prints the username of the disconnected user
   socket.on('disconnect', () => {
       console.log('User disconnected - Username: ' + socket.username);
   });
 
   // Handle a new message event that sends all message objects to the server via an emit method. These objects contain the message,
   // as well as the username of the sender. They are being sent to all users, including the sender, as a send message event
   socket.on('new message', (msg) => {
       io.emit('send message', {message: msg, user: socket.username});
   });
 
   // When a user enters their username on the client-side, the server receives it as a new user
   // event and prints a connection message along with the username of the connected user
   socket.on('new user', (usr) => {
       socket.username = usr;
       console.log('User connected - Username: ' + socket.username);
   });
});