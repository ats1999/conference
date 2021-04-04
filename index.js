const express = require('express');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser');
const { v4 } = require('uuid')
const port = 5000;

app.use(bodyParser.json());
app.use(require('cors')());

app.get('/',(_,res)=>{
    res.json('Rahul');
})

io.on('connection',socket=>{
    console.log('a socket connected');
    socket.on('join-room',(roomId,userId)=>{
        console.log(`user ${userId} joined ${roomId}`);
        socket.join(roomId);
        socket.to(roomId).emit('user-connected',userId);
        
        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })

    socket.on('get-room-id',()=>{
        socket.emit('room-id-arrives',v4());
    })
})

server.listen(process.env.PORT || port,()=>{
    console.log(`Server is running on ${process.env.PORT || port}`)
});