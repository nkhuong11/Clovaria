import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Navbar from './components/Navbar/Navbar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

import './App.css';

class Wrapper extends Component {
    constructor(props) {
        //console.log('WRAPPER CONSTRUCTOR')
        super(props);
        this.checkAuthentication = this.checkAuthentication.bind(this);
        this.checkAuthentication();
    }
    
    checkAuthentication() {
        //console.log('WRAPPER checkAuthentication')
        if(this.props.auth.isAuthenticated === true) {
            let user = {
                id: this.props.auth.user._id,
                friend_list: this.props.auth.user.friend_list
            }
            //console.log('WRAPPER checkAuthentication EMIT')
            this.props.socket.emit('user login', user);
        }
    }

    render() {
        // const profileURL = `/profile/${this.props.auth.user.username}`
        return (
            <Router>
                <div className="root-container">
                    <Navbar socket={this.props.socket}/>
                    <div className="body-container">
                        <Route exact path="/login" render={props => (<LoginPage {...props} socket={this.props.socket}/>)} />
                        <Route exact path="/register" render={props => (<RegisterPage {...props} socket={this.props.socket}/>)} />
                        <Route exact path="/profile/:username" render={props => (<ProfilePage {...props} socket={this.props.socket}/>)} />
                        <Route exact path="/" render={props => (<HomePage {...props} socket={this.props.socket}/>)} />
                    </div>
                </div>
            </Router>
        );
    }
}


const mapStateToProps = (state) => ({
    auth: state.auth,
})

export default connect(mapStateToProps)(Wrapper)