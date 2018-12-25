import React, { Component } from 'react';

import '../css/FriendList.css';

class FriendDetail extends Component {
    render(){
        return (
            <div className="custom-wrapper"> 
                <img src={this.props.user.avatar} alt={this.props.user.username} title={this.props.user.username}
                        className="rounded-circle friend-avatar" />
                <div className="user-name">
                    {this.props.user.username}
                </div>
            </div>

        );
    }
}

export default FriendDetail;