import React, { Component } from 'react';

import '../css/ChatBox.css'

class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message : ''
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.closeChatBox = this.closeChatBox.bind(this);
    }
    
    onSubmit(e) {
        console.log(e.target);
    }

    closeChatBox(user) {
        this.props.onCloseChatBox(user);
    }

    render() {
        const {user} = this.props;

        return (
            <div className="chatbox-container">
                <div className="chatbox-header">
                    {user.username}
                    <div className="close-chatbox-btn" onClick={() => this.closeChatBox(user)}>
                        X
                    </div>
                </div>
                <div className="chatbox-content">
                    <div className="msg_push"></div>
                </div>
                <div className="chatbox-bottom">
                       <input className="chat-input" type="text" 
                       placeholder="Type..."  
                       onSubmit={(e) => this.onSubmit(e)}/>
                </div>
            </div>
        );
    }
}

export default ChatBox;
