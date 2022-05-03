// const { listenerCount } = require("process");

const socket=io();

const messageInput=document.getElementById("msg");
const chatForm=document.getElementById("chat-form");
const chatMessage=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');

//username from URL
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

console.log(username);
//setup
socket.emit('join-room',username,room);



// message from server
socket.on("message-receive",message=>{
    outMessage(message);
    chatMessage.scrollTop=chatMessage.scrollHeight;
});

socket.on('roomUsers',({room,users})=>{
    displayRooms(room);
    displayUser(users);
});

const displayRooms=(room)=>{
    roomName.innerText=room;
}
const displayUser=(users)=>{
    
    userList.innerHTML = '';
    for(var i=0;i<users.length;i++){
        const li =document.createElement('li');
        li.innerText=users[i].name;
        userList.appendChild(li);
    }
}

chatForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    const message=messageInput.value;


    if(message!=""){
        //emmit message to server
        socket.emit('message-send',message,username);
        messageInput.value="";
    }
});

const outMessage=(message)=>{
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.userName} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`

    document.querySelector('.chat-messages').appendChild(div);
}