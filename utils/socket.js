connectedUsers = {};

class Socket {
    constructor(socket) {
        this.io = socket;
        this.socketEvents = this.socketEvents.bind(this);
        this.updateConnectedUsers = this.updateConnectedUsers.bind(this);
        this.sendOnlineStatusToFriends = this.sendOnlineStatusToFriends.bind(this);
        this.sendOfflineStatusToFriends = this.sendOfflineStatusToFriends.bind(this);
        this.getActiveFriendList = this.getActiveFriendList.bind(this);
    }

    sendOnlineStatusToFriends(friend_list, socket){
        if (connectedUsers.length !== 0) {
            let activeUser = Object.keys(connectedUsers);
            for (let i = 0; i < friend_list.length; i++) {
                if(activeUser.includes(friend_list[i])) {
                    let ID = connectedUsers[friend_list[i]].id // get the socket id of this friend
                    socket.to(ID).emit('new online signal', socket.userID)
                }
            }
        }
        return;
    }

    sendOfflineStatusToFriends(friend_list, socket){
        if (connectedUsers.length !== 0) {
            let activeUser = Object.keys(connectedUsers);
            for (let i = 0; i < friend_list.length; i++) {
                if(activeUser.includes(friend_list[i])) {
                    let ID = connectedUsers[friend_list[i]].id // get the socket id of this friend
                    socket.to(ID).emit('new offline signal', socket.userID)
                }
            }
        }
        return;
    }

    updateConnectedUsers(){
        //using for new register
        this.io.emit('update active users', Object.keys(connectedUsers));
    }

    getActiveFriendList(friendList, socket){
        if (connectedUsers.length !== 0) {
            let activeUser = Object.keys(connectedUsers);
            let activeFriendList = [];
            for (let i = 0; i < friendList.length; i++) {
                if(activeUser.includes(friendList[i])) {
                    activeFriendList.push(friendList[i])
                }
            }
            socket.emit('response active friend list', activeFriendList);
        }
        return;
    }

    socketEvents() {

        this.io.on('connection', (socket) => {
            console.log("New access")
            socket.on('user login', (user) => {
                if (user.id in connectedUsers){
                    this.sendOnlineStatusToFriends(user.friend_list, socket);
                    this.getActiveFriendList(user.friend_list,socket);
                } else {
                    socket.userID = user.id;
                    connectedUsers[user.id] = socket;
                    this.updateConnectedUsers();
                    this.sendOnlineStatusToFriends(user.friend_list, socket);
                    this.getActiveFriendList(user.friend_list,socket);
                }    
                console.log('connectedUsers: ', Object.keys(connectedUsers));
            });

            socket.on('user logout', (user) => {
                console.log('User logout');
                this.sendOfflineStatusToFriends(user.friend_list, socket);
                delete connectedUsers[user.id];
                this.updateConnectedUsers();
                console.log('connectedUsers: ', Object.keys(connectedUsers));
            });

            socket.on('request active friend list', (friendList) => {
                console.log(friendList)
                this.getActiveFriendList(friendList,socket);
            })

            socket.on('send message', (data) => {
                //userID: id of friend that we send message to
                if (data.toID in connectedUsers){
                    //if this user is online
                    //connectedUsers[data.toID].emit('receive message', {id: socket.id, message: data.message});
                    this.io.to(connectedUsers[data.toID].id).emit('receive message', {id: socket.userID, message: data.message});
                }
            });
            
            socket.on('disconnect', (data) => {
                console.log("Client left!");
                if (!socket.id) 
                    return;
                delete connectedUsers[socket.id];
                this.updateConnectedUsers();
                console.log('connectedUsers: ', Object.keys(connectedUsers));
            });

        });
    }

    socketConfig(){
        this.socketEvents();
    }

}

module.exports = Socket;