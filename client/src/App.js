// import React, { Component } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// import Header from './components/Header';
// import Post from './components/Post';
// import RegisterPage from './pages/RegisterPage';

// class App extends Component {
//   render() {
//     return (
//       // <div>
//       //   <Header />
//       //   <div>
//       //     <Post nickname="Khuong Nguyen" avatar="https://yt3.ggpht.com/a-/AN66SAwia_DZGIdqBNOUTVD81qzFZTRzp_SpwIY9Ww=s900-mo-c-c0xffffffff-rj-k-no" caption="Moving the community!" image="https://hdqwalls.com/download/city-lights-buildings-4k-og-2048x1152.jpg" />
//       //     <Post nickname="Khuong Nguyen" avatar="https://yt3.ggpht.com/a-/AN66SAwia_DZGIdqBNOUTVD81qzFZTRzp_SpwIY9Ww=s900-mo-c-c0xffffffff-rj-k-no" caption="Holding a mic" image="http://i.imgur.com/TnaS8D0.png" />
//       //   </div>
//       // </div>
//       <RegisterPage/>
//     );
//   }
// }

// export default App;

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './services/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authentication';
import { getAllUsers } from './actions/getData';
import Navbar from './components/Navbar/Navbar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

import 'bootstrap/dist/css/bootstrap.min.css';

// if(localStorage.jwtToken) {
//   setAuthToken(localStorage.jwtToken);
//   const decoded = jwt_decode(localStorage.jwtToken);
//   store.dispatch(setCurrentUser(decoded));
//   store.dispatch(getAllUsers());

//   const currentTime = Date.now() / 1000;
//   if(decoded.exp < currentTime) {
//     store.dispatch(logoutUser());
//     window.location.href = '/login'
//   }
// }

class App extends Component {

  componentDidMount (){
    if(localStorage.jwtToken) {
      setAuthToken(localStorage.jwtToken);
      const decoded = jwt_decode(localStorage.jwtToken);
      store.dispatch(setCurrentUser(decoded));
      //store.dispatch(getAllUsers());
    
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
            <div>
              <Navbar />
              <div className="container">
                <Route exact path="/register" component={ RegisterPage } />
                <Route exact path="/login" component={ LoginPage } />
                <Route exact path="/profile" component={ ProfilePage } />
              </div>
              <Route exact path="/" component={ HomePage } />
            </div>
          </Router>
        </Provider>
    );
  }
}

export default App;