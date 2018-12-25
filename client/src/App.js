import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
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
class App extends Component {
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
            <Navbar />
            <div className="body-container">
                <Route exact path="/login" component={ LoginPage } />
                <Route exact path="/register" component={ RegisterPage } />
                <Route exact path="/profile" component={ ProfilePage } />
                <Route exact path="/chat" component={ ChatPage } />
                <Route exact path="/" component={ HomePage } />
            </div>
            
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;