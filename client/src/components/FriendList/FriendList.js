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
        this.renderFriendList = this.renderFriendList.bind(this);
        this.getFriendListData = this.getFriendListData.bind(this);
        this.openChatBox = this.openChatBox.bind(this);
        this.closeChatBox = this.closeChatBox.bind(this);
        this.renderChatBox = this.renderChatBox.bind(this);
    }
    
    componentDidMount() {
        let friendList = this.getFriendListData(this.props.currentUser.friend_list, this.props.allUser);
        this.setState({friendList})
        
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.currentUser !== nextProps.currentUser) 
        {
            let friendList = this.getFriendListData(nextProps.currentUser.friend_list, nextProps.allUser);
            this.setState({friendList})
        }
    } 

    

    getFriendListData(friend_list, all_user){
        const friends = all_user.filter(user => {
            for (let i = 0; i < friend_list.length; i++) {
                if (user._id == friend_list[i]) {
                    return true;
                }
            }
            return false;
        })
        return friends;
    }

    openChatBox(user){
        if(!this.state.listChatBox.includes(user)) {
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
        return friends.map((each, index) => {
            return (
                <li className="friend-detail-container">
                    <FriendDetail key={index} user={each} onOpenChatBox={this.openChatBox}/>
                </li>
                
            )
        })
    }

    renderChatBox() {
        return this.state.listChatBox.map(user => {
            return (
                <ChatBox key={user} user={user} onCloseChatBox={this.closeChatBox}/>
            );
        })
    }


    render(){
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
