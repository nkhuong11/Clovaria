import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import socketIOClient from "socket.io-client";


import setAuthToken from './services/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authentication';
import { getAllUsers } from './actions/getData';
import Wrapper from './Wrapper';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';



class App extends Component {
  constructor() {
    super();
    this.checkjwtToken();
    this.socket = socketIOClient('https://safe-ridge-22159.herokuapp.com');
    //this.socket = socketIOClient('http://localhost:5000');
    
  }

  checkjwtToken(){
    if(localStorage.jwtToken) {
      setAuthToken(localStorage.jwtToken);
      const decoded = jwt_decode(localStorage.jwtToken);
      const currentTime = Date.now() / 1000;
      if(decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        window.location.href = '/login'
      }
      store.dispatch(setCurrentUser(decoded));
      store.dispatch(getAllUsers());
    }
  }

  render() {
    return (
      <Provider store = { store }>
        <Wrapper socket={this.socket}/>
      </Provider>
    );
  }
}

export default App;

