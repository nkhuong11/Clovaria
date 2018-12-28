import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import socketIOClient from "socket.io-client";

import setAuthToken from './services/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authentication';
//import { getAllUsers } from './actions/getData';
import Navbar from './components/Navbar/Navbar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage/ChatPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const socket = socketIOClient('http://localhost:5000');
//const socket = socketIOClient();
socket.on('active users', (data) => {
  console.log('active users', data);
})

socket.on('open chatbox from server', (id) => {
  console.log('message: ' + id);
})



class App extends Component {
  constructor() {
    super();
  }

  componentDidMount (){

    if(localStorage.jwtToken) {
      setAuthToken(localStorage.jwtToken);
      const decoded = jwt_decode(localStorage.jwtToken);
      store.dispatch(setCurrentUser(decoded));
      const currentTime = Date.now() / 1000;
      if(decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        window.location.href = '/login'
      }
    }
  }

  render() {
    return (
      <Provider store = { store }>
        <Router>
          <div className="root-container">
            <Navbar socket={socket}/>
            <div className="body-container">
                <Route exact path="/login" render={props => (<LoginPage {...props} socket={socket}/>)} />
                <Route exact path="/register" render={props => (<RegisterPage {...props} socket={socket}/>)} />
                <Route exact path="/profile" render={props => (<ProfilePage {...props} socket={socket}/>)} />
                <Route exact path="/" render={props => (<HomePage {...props} socket={socket}/>)} />
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;