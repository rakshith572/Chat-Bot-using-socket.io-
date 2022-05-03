const port=5000;
const express=require('express');
const http=require('http');
const socket=require('socket.io');
const moment=require('moment');
const app=express();
const server=http.createServer(app);
const io=socket(server);

const u=require('../utils/user.js');

app.use(express.static('../client'));// load front end

io.on('connection',(socket)=>{
    // console.log(socket.id);
    socket.on('join-room',(username,room)=>{
        const user=u.userJoin(socket.id,username,room);
        socket.join(room);
        socket.broadcast.to(user.room).emit('message-receive',messageFormate(`a ${username} has joined the chat`,"ADMIN"));
        
        io.to(room).emit('roomUsers',{
            room,
            users:u.getRoomUsers(room)
        });
    });
    // console.log(socket.id);
    

    //message from client
    socket.on('message-send',(message,username)=>{
        // socket.join(room);
        const user=u.getUser(socket.id);
        io.to(user.room).emit("message-receive",messageFormate(message,username));
    });

    // when user closes the tab
    socket.on('disconnect',()=>{
        const user=u.userLeave(socket.id);
        if(user){
            io.to(user.room).emit("message-receive",messageFormate(`a ${user.name} has left the chat`,"ADMIN"));
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:u.getRoomUsers(user.room)
            });
        }
    });

});

const messageFormate=(text,userName)=>{
    return {
        userName,
        text,
        time:moment().format('h:mm a')
    }
}

server.listen(port,()=>console.log(`server listening at port ${port}`));