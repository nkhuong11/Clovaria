import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authentication';
import { getAllUsers } from '../../actions/getData';
import { withRouter } from 'react-router-dom';

import SearchBar from '../SearchBar/SearchBar';
import '../css/Navbar.css';
class Navbar extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     searchContent: ''
        // }
        // this.onSearchChange = this.onSearchChange.bind(this);
        // this.renderUserList = this.renderUserList.bind(this);
    }

    componentDidMount() {
        this.props.getAllUsers();
    }
    

    onLogout(e) {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
    }

    render() {
        const {isAuthenticated, user} = this.props.auth;

        const searchBar = (
            <SearchBar allUser={this.props.allUser} thisUser={this.props.auth.user} />
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
                <div className="navbar-logo">
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
    allUser: state.allData.all_users
})

export default connect(mapStateToProps, { logoutUser, getAllUsers})(withRouter(Navbar));