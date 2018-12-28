import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../css/ChatBox.css'

class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message : '',
            messageHistory: [],
        };
        this.onEnterPress = this.onEnterPress.bind(this);
        this.closeChatBox = this.closeChatBox.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.renderMessages = this.renderMessages.bind(this);

        this.props.socket.on('receive message', (data) => {
            this.updateMessage(data)
        })
        
    }

    updateMessage(data) {
        console.log(data)
    }

    onEnterPress(e) {
        if (e.key === 'Enter') {
            this.props.socket.emit('send message', {toID: this.props.user._id, message: this.state.message});
            this.setState(prevState  => ({
                    message: '',
                    messageHistory: [...prevState.messageHistory, prevState.message]
                }));
        }
        
    }

    updateInputValue(e) {
        this.setState({
          message: e.target.value
        });
      }

    closeChatBox(user) {
        this.props.onCloseChatBox(user);
    }

    renderMessages(){
        return this.state.messageHistory.map((mess, index) => {
            return (
                <div key={index} className="message-container">
                    <img src={this.props.currentUser.avatar} alt={this.props.currentUser.username} title={this.props.currentUser.username}
                        className="rounded-circle friend-avatar"/>
                    <div className="message">
                        {mess}
                    </div>
                </div>
            );
        })
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
                    {this.renderMessages()}
                </div>
                <div className="chatbox-bottom">
                       <input className="chat-input" type="text" 
                            placeholder="Type..."  
                            onKeyPress={(e) => this.onEnterPress(e)}
                            value={this.state.message}
                            onChange={this.updateInputValue}/>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    currentUser: state.auth.user,
})

export default connect(mapStateToProps)(ChatBox);

