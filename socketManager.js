const io = require('./server.js').io;

const { 
    COMMUNITY_CHAT, MESSAGE_RECIEVED, MESSAGE_SENT, 
    USER_CONNECTED, USER_DISCONNECTED, TYPING, VERIFY_USER, LOGOUT
    } = require('./client/src/pages/ChatPage/Events')

const { createUser, createChat, createMessage } = require('./client/src/pages/ChatPage/Factories')

const connectedUsers = { }

module.exports = function(socket){
    console.log('Socket Id: ' + socket.id);

    //Verify Username 1
    socket.on(VERIFY_USER, function(nickname, callback){
        if(!isUser(connectedUsers, newUser)){
            callback({isUser:false, user:createUser({name:newUser})})
        }else{
            callback({isUser:true, user: null})
        }
    })

}

function addUser(userList, user){
    let newList = Object.assign({}, userList)
    newList[user.name] = user
    return newList
}

function removeUser(userList, username){
    let newList = Object.assign({}, userList)
    delete newList[username]
    return newList
}

function isUser(userList, username){
    return username in userList
}