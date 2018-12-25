import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FriendDetail from './FriendDetail';
import '../css/FriendList.css';

class FriendList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friendList: []
        }
        this.renderFriendList = this.renderFriendList.bind(this);
        this.getFriendListData = this.getFriendListData.bind(this);
    }
    
    componentDidMount() {
        let friendList = this.getFriendListData(this.props.currentUser.friend_list, this.props.allUser);
        this.setState({friendList})
        console.log('FRIENDLIST STATE: ', this.state.friendList);
    }

    renderFriendList(friends) {
        return friends.map((each, index) => {
            return (
                <li className="friend-detail-container">
                    <FriendDetail key={index} user={each}/>
                </li>
                
            )
        })
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
        console.log('FRIENDS', friends);
        return friends;
    }


    render(){
        return (
            <div className="friend-list-container">
                {this.renderFriendList(this.state.friendList)}
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    currentUser: state.auth.user,
    allUser: state.allData.all_users
})

export default connect(mapStateToProps)(FriendList);
