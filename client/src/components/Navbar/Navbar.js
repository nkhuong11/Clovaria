import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser, setCurrentUser } from '../../actions/authentication';
import { getAllUsers } from '../../actions/getData';
import { withRouter } from 'react-router-dom';

import jwt_decode from 'jwt-decode';

import SearchBar from '../SearchBar/SearchBar';
import '../css/Navbar.css';
class Navbar extends Component {
    constructor(props) {
        super(props);
        console.log('------NAVBAR CONSTRUCTOR--------');
        
    }

    componentWillMount() {
        console.log('------NAVBAR WILL MOUNT--------');
    }

    componentDidMount() {
        console.log('------NAVBAR DID MOUNT--------');
    }

    onLogout(e) {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
        
    }

    componentWillReceiveProps(nextProps) {
        console.log('------NAVBAR WILL ReceiveProps--------');
        if(!this.props.auth.isAuthenticated &&  nextProps.auth.isAuthenticated) {
            this.props.getAllUsers();
        } 
        
        if(this.props.auth.isAuthenticated && !nextProps.auth.isAuthenticated) {
            let user = {
                id: this.props.auth.user._id,
                friend_list: this.props.auth.user.friend_list
            }
            this.props.socket.emit('user logout', user);
        } 
    }

    render() {
        const {isAuthenticated, user} = this.props.auth;

        const searchBar = (
            <SearchBar allUser={this.props.allUser} thisUser={this.props.auth.user} setCurrentUser={this.props.setCurrentUser} />
        )

        const authLinks = (
            <ul className="navbar-right-item">
                <a href="#" className="" onClick={this.onLogout.bind(this)}>
                    <img src={user.avatar} alt={user.username} title={user.username}
                        className="rounded-circle"
                        style={{ width: '25px', marginRight: '5px'}} />
                            Logout
                </a>
            </ul>
        )

        const guestLinks = (
            <ul className="navbar-right-item-wrapper">
                <div>
                    <Link className="navbar-right-item" to="/register">Sign Up</Link>
                </div>
                <div>
                    <Link className="navbar-right-item" to="/login">Sign In</Link>
                </div>
            </ul>
        )
        return(
            <nav className="my-custom-navbar">
                <div className="navbar-logo" onClick={this.clovaria}>
                    <Link to="/">Clovaria</Link>
                </div>
                {isAuthenticated ? searchBar : <div/>}
                <div className="navbar-right-item">
                    {isAuthenticated ? authLinks : guestLinks}
                </div>
            </nav>
        )
    }
}
Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    getAllUsers: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    allUser: state.data.all_users
})

export default connect(mapStateToProps, { logoutUser, getAllUsers, setCurrentUser})(withRouter(Navbar));