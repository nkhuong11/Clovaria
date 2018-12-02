import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authentication';
import { getAllUsers } from '../../actions/getData';
import { withRouter } from 'react-router-dom';


import '../css/Navbar.css';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchContent: ''
        }
        this.onSearchChange = this.onSearchChange.bind(this);
        this.renderUserList = this.renderUserList.bind(this);
    }

    findUser(name, userList) {
        let result = userList.filter(user => {
            return user.username.toLowerCase().includes(name.toLowerCase());
        })
        return result;
    }

    renderUserList(){
        return (
            <div>New User</div>
        )
    }

    onSearchChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
        if(e.target.value !== '') {
            const users = this.findUser(e.target.value, this.props.allUser);
            console.log(users)
            if(users) {
                this.renderUserList() 
            } 
        }
        
    }

    onLogout(e) {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
    }

    render() {
        const {isAuthenticated, user} = this.props.auth;
        const authLinks = (
            <ul className="navbar-nav ml-auto">
                <div className="search-wrapper">
                    <input className="searchbar" type="text" autoCapitalize="none" placeholder="Search" value={this.state.searchContent} name="searchContent"
                            onChange={this.onSearchChange}/>
                </div>
                <a href="#" className="nav-link" onClick={this.onLogout.bind(this)}>
                    <img src={user.avatar} alt={user.name} title={user.name}
                        className="rounded-circle"
                        style={{ width: '25px', marginRight: '5px'}} />
                            Logout
                </a>
            </ul>
        )

        const guestLinks = (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <Link className="nav-link" to="/register">Sign Up</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/login">Sign In</Link>
                </li>
            </ul>
        )
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to="/">Clovaria</Link>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {isAuthenticated ? authLinks : guestLinks}
                </div>
            </nav>
        )
    }
}
Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    allUser: state.allData.all_users
})

export default connect(mapStateToProps, { logoutUser, getAllUsers })(withRouter(Navbar));