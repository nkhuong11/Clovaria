import React, { Component } from 'react';
import { connect } from 'react-redux';

import InputField from './InputField'

import '../css/ChatBox.css'

class ChatBox extends Component {
    constructor(props) {
        super(props);
        if (this.props.user.incommingMessage !== null){
            this.state = {
                messageHistory: [this.props.user.incommingMessage],
            };
        } else {
            this.state = {
                messageHistory: [],
            };
        }
        
        this.onEnterPress = this.onEnterPress.bind(this);
        this.closeChatBox = this.closeChatBox.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.renderMessages = this.renderMessages.bind(this);
        this.isOnline = this.isOnline.bind(this);
        this.props.socket.on('receive message', (data) => {
            this.updateMessage(data)
        })
        
    }
    

    updateMessage(data) {
        if(data.id === this.props.user._id) {
            this.setState(prevState  => ({
                messageHistory: [...prevState.messageHistory, data]
            }));
        }
        
    }

    onEnterPress(mess) {
        this.props.socket.emit('send message', {toID: this.props.user._id, message: mess});
        this.setState(prevState  => ({
                messageHistory: [...prevState.messageHistory, 
                    {
                        message: mess,
                        id: this.props.currentUser._id,
                    }]
            }));
        
    }

    isOnline(){
        if(this.props.user.isActive) {
            return (
                <div className="rounded-circle online-signal"/>
            );
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
        return this.state.messageHistory.map((currentMessage, index) => {
            if (currentMessage.id === this.props.currentUser._id) {
                return (
                    <div key={index} className="my-message-container">
                        <div className="message">
                            {currentMessage.message}
                        </div>
                    </div>
                );
            } else {
                if(this.state.messageHistory[index-1] !== undefined && this.state.messageHistory[index-1].id === currentMessage.id) {
                    return (
                        <div key={index} className="friend-message-container message-continue">
                            <div className="message">
                                {currentMessage.message}
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div key={index} className="friend-message-container">
                            <img src={this.props.user.avatar} alt={this.props.user.username} title={this.props.user.username}
                                className="rounded-circle user-avatar"/>
                            <div className="message">
                                {currentMessage.message}
                            </div>
                        </div>
                    );
                }
            }
            
        })
    }

    render() {
        const {user} = this.props;

        return (
            <div className="chatbox-container">
                <div className="chatbox-header">
                    <div className="username-wrapper">
                        {this.isOnline()}
                        {user.username}
                    </div>
                    <div className="close-chatbox-btn" onClick={() => this.closeChatBox(user)}>
                        X
                    </div>
                </div>
                <div className="chatbox-content">
                    {this.renderMessages()}
                </div>
                <div className="chatbox-bottom">
                        <InputField onEnterPress={this.onEnterPress}/>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    currentUser: state.auth.user,
})

export default connect(mapStateToProps)(ChatBox);

