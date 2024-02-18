const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST'] 
    }
});

const PORT = 5000;

app.use(cors());

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('message', (data) => {
        console.log('Received message:', data);
        socket.broadcast.emit('received', { text: data, type: "receive" }); 
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
