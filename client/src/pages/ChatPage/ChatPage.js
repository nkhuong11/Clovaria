import React, { Component } from 'react';
import io from 'socket.io-client';

import LoginForm from './LoginForm';

import { USER_CONNECTED, LOGOUT } from './Events';


const socketUrl = "http://localhost:5000/"
class ChatPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: null,
            user: null
        };
    }

    componentWillMount() {
        this.initSocket();
    }
    
    initSocket(){
        const socket = io(socketUrl);
        socket.on('connect', () => {
            console.log('Connected')
        })
        this.setState({socket});
    }

    setUser(user) {
        const { socket } = this.state;
        socket.emit(USER_CONNECTED, user);
        this.setState({user});
    }

    logout() {
        const { socket } = this.state;
        socket.emit(LOGOUT);
        this.setState({
            user: null
        })
    }

    render() {
        const { socket } = this.state;
        return (
            <div>
                <LoginForm socket={socket} setUser={this.setUser}/>
            </div>
        );
    }
}

export default ChatPage;
