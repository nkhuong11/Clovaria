import React, { Component } from 'react';
import { connect } from 'react-redux';


import ChatBox from '../ChatBox/ChatBox'
import FriendDetail from './FriendDetail';
import '../css/FriendList.css';

class FriendList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friendList: [],
            listChatBox: [],
        }

        console.log('------FRIENDLIST CONSTRUCTOR--------');

        this.renderFriendList = this.renderFriendList.bind(this);
        this.getFriendListData = this.getFriendListData.bind(this);
        this.openChatBox = this.openChatBox.bind(this);
        this.closeChatBox = this.closeChatBox.bind(this);
        this.renderChatBox = this.renderChatBox.bind(this);
        this.autoOpenChatBox = this.autoOpenChatBox.bind(this);
        this.getActiveFriendList = this.getActiveFriendList.bind(this);
        this.updateOnlineFriendList = this.updateOnlineFriendList.bind(this);

        this.props.socket.on('response active friend list', (activeFriendList) => {
            console.log('response active friend list: ', activeFriendList);
            this.updateOnlineFriendList(activeFriendList);
        })

        this.props.socket.on('update active users', (activeUsers) => {
            console.log(activeUsers);
        })

        this.props.socket.on('new online signal', (userID) => {
            console.log('new online signal');
            this.updateOnlineFriendList([userID]);
        })

        this.props.socket.on('new offline signal', (userID) => {
            console.log('new offline signal');
            this.updateOfflineFriendList([userID]);
        })


        this.props.socket.on('receive message', (data) => {
            this.autoOpenChatBox(data.id, data.message);
        })

        //this.getActiveFriendList();
    }

    updateOnlineFriendList(onlineFriendList){
        console.log('updateOnlineFriendList FUNCTION');
        //update state

        this.setState({
            friendList: this.state.friendList.map(each => (onlineFriendList.includes(each._id) ? Object.assign({}, each, { isActive:true }) : each)),
            listChatBox: this.state.listChatBox.map(each => (onlineFriendList.includes(each._id) ? Object.assign({}, each, { isActive:true }) : each))
          });
    }

    updateOfflineFriendList(offlineFriendList){
        console.log('updateOfflineFriendList FUNCTION');
        //update state

        this.setState({
            friendList: this.state.friendList.map(each => (offlineFriendList.includes(each._id) ? Object.assign({}, each, { isActive:false }) : each)),
            listChatBox: this.state.listChatBox.map(each => (offlineFriendList.includes(each._id) ? Object.assign({}, each, { isActive:false }) : each))
          });
    }

    getActiveFriendList(friend_list) {
        console.log('request active friend list', friend_list);
        this.props.socket.emit('request active friend list', friend_list);
    }
    
    componentDidMount() {
        console.log('------FRIENDLIST componentDidMount--------');
    }

    componentWillMount() {
        console.log('------FRIENDLIST componentWillMount--------');
    }


    componentWillReceiveProps(nextProps) {
        console.log('------FRIENDLIST componentWillReceiveProps--------');

        if((this.props.allUser !== nextProps.allUser) || (this.props.currentUser !== nextProps.currentUser)) {
            let friendList = this.getFriendListData(nextProps.currentUser.friend_list, nextProps.allUser);
            this.setState({friendList});
            this.getActiveFriendList(nextProps.currentUser.friend_list);
        }

    }

    getFriendListData(friend_list, all_user){
        const friends = all_user.filter(user => {
            for (let i = 0; i < friend_list.length; i++) {
                if (user._id === friend_list[i]) {
                    user.isActive = false;
                    return true;
                }
            }
            return false;
        })
        return friends;
    }

    autoOpenChatBox(userID, message) {
        for(let i = 0; i < this.state.friendList.length; i++ ) {
            if (userID === this.state.friendList[i]._id) {
                let user = this.state.friendList[i]
                if(!this.state.listChatBox.includes(user)) {
                    user.incommingMessage = {
                        id: userID,
                        message: message
                    }
                    this.setState({
                        listChatBox: [...this.state.listChatBox, user]
                    })
                }
                return;
            }
        }
    }

    openChatBox(user){
        if(!this.state.listChatBox.includes(user)) {
            user.incommingMessage = null;
            this.setState({
                listChatBox: [...this.state.listChatBox, user]
            })
        }
    }

    closeChatBox(user) {
        let newListChatBox = [...this.state.listChatBox];
        var index = newListChatBox.indexOf(user)
        if (index !== -1) {
            newListChatBox.splice(index, 1);
          this.setState({listChatBox: newListChatBox});
        }
    }

    renderFriendList(friends) {
        console.log('FRIEND: ', friends);
        return friends.map((each, index) => {
            return (
                <li className="friend-detail-container" key={index}>
                    <FriendDetail user={each} onOpenChatBox={this.openChatBox.bind(this)} />
                </li>
                
            )
        })
    }

    renderChatBox() {
        return this.state.listChatBox.map((user, index) => {
            return (
                <ChatBox key={index} user={user} onCloseChatBox={this.closeChatBox} socket={this.props.socket}/>
            );
        })
    }


    render(){
        console.log('RENDER: ', this.state);
        return (
            <div className="friend-list-container">
                {this.renderFriendList(this.state.friendList)}
                <div className='list-chatbox-container'>
                    {this.renderChatBox()}
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    currentUser: state.auth.user,
    allUser: state.data.all_users
})

export default connect(mapStateToProps)(FriendList);
