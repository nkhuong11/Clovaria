import React, { Component } from 'react';

import '../css/FriendList.css';

class FriendDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
        this.openChatBox = this.openChatBox.bind(this);
    }

    openChatBox() {
        this.props.onOpenChatBox(this.props.user);
    }

    
    render(){
        const {user} = this.props;
        return (
            <div className="custom-wrapper" onClick={this.openChatBox}> 
                <img src={user.avatar} alt={user.username} title={user.username}
                        className="rounded-circle friend-avatar" />
                <div className="user-name">
                    {this.props.user.username}
                </div>
            </div>
        );
    }
}

export default FriendDetail;