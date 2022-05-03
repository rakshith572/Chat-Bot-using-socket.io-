const users=[];

const userJoin=(socketID,name,room)=>{
    const user={
        id:socketID,
        name,
        room,
    }
    users.push(user);
    return user;
}

const getUser=(id)=>{
    // const ans;
    for(let i=0;i<users.length;i++){
        if(users[i].id===id){
            return users[i];
        }
    }
    // return user;
}

const userLeave=(id)=> {
    const index = users.findIndex(user => user.id === id);
  
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
  }

  const getRoomUsers=(room)=>{

    const ans=[];

    for(let i=0;i<users.length;i++){
        if(users[i].room==room){
            ans.push(users[i]);
        }
    }
    return ans;
  }


module.exports={userJoin,getUser,userLeave,getRoomUsers};