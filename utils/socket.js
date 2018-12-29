connectedUsers = {};

class Socket {
    constructor(socket) {
        this.io = socket;
        this.socketEvents = this.socketEvents.bind(this);
        this.updateConnectedUsers = this.updateConnectedUsers.bind(this);
    }

    updateConnectedUsers(){
        // sending to all connected clients
        this.io.emit('active users', Object.keys(connectedUsers));
    }

    socketEvents() {


        this.io.on('connection', (socket) => {
            console.log("New access")
            socket.on('user login', (userID) => {
                if (userID in connectedUsers){
                    console.log(`${userID} is already in connectedUsers`)
                } else {
                    console.log(`Add ${userID} to connectedUsers`)
                    socket.id = userID;
                    connectedUsers[socket.id] = socket;
                    this.updateConnectedUsers();
                }    
                console.log('connectedUsers: ', Object.keys(connectedUsers));
            });

            socket.on('user logout', (userID) => {
                console.log('User logout');
                delete connectedUsers[userID];
                this.updateConnectedUsers();
                console.log('connectedUsers: ', Object.keys(connectedUsers));
            });

            socket.on('send message', (data) => {
                //userID: id of friend that we send message to
                if (data.toID in connectedUsers){
                    //if this user is online
                    connectedUsers[data.toID].emit('receive message', {id: socket.id, message: data.message});
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

           
            
            // ```Get the user's chat list```

            // socket.on('chat-list', (data) => {
 
            //     let chatListResponse = {};
  
            //      if (data.userId == '') {
  
            //          chatListResponse.error = true;
            //          chatListResponse.message = `User does not exits.`;
                     
            //          this.io.emit('chat-list-response',chatListResponse);
  
            //      } else {
  
            //          helper.getUserInfo( data.userId,(err, UserInfoResponse)=>{
  
            //              delete UserInfoResponse.password;
            //              delete UserInfoResponse.timestamp;
                         
            //              helper.getChatList(data.userId, (err, response)=>{
                             
            //                  this.io.to(socket.id).emit('chat-list-response',{
            //                      error : false ,
            //                      singleUser : false ,
            //                      chatList : response === null ? null : response.users
            //                  });
  
            //                  if (response !== null) {
            //                      let chatListIds = response.socketIds;
            //                      chatListIds.forEach( (Ids)=>{
            //                          this.io.to(Ids.socketId).emit('chat-list-response',{
            //                              error : false ,
            //                              singleUser : true ,
            //                              chatList : UserInfoResponse
            //                          });
            //                      });
            //                  }
            //              });
            //          });
            //      }
            // });
            /**
            * Logout the user
            */
        //    socket.on('logout',(data)=> {
 
        //         const userId = data.userId;
        //         helper.logout(userId , (error, result)=>{
        //             this.io.to(socket.id).emit('logout-response',{
        //                 error : false
        //             });
        //             socket.disconnect();
        //         }); 
        //     });


        /**
        * sending the disconnected user to all socket users. 
        */
            // socket.on('disconnect',()=>{
            //     setTimeout(()=>{
            //         helper.isUserLoggedOut(socket.id,(response)=>{
            //             if (response.loggedOut) {
            //                 socket.broadcast.emit('chat-list-response',{
            //                     error : false ,
            //                     userDisconnected : true ,
            //                     socketId : socket.id
            //                 });
            //             }
            //         });
            //     },1000);
            // });

        });
    }

    socketConfig(){
 
        // this.io.use(function(socket, next) {
        //     let userID = socket.request._query['userId'];
        //     let userSocketId = socket.id;
        //     const data = {
        //         id : userID,
        //         value : {
        //             $set :{
        //                 socketId : userSocketId,
        //                 online : 'Y'
        //             }
        //         }
        //     }
 
        //     helper.addSocketId( data ,(error,response)=>{
        //         next();
        //     });
        // });
 
        this.socketEvents();
    }

}

module.exports = Socket;