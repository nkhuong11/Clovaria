import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../../services/setAuthToken';


import '../css/Searchbar.css'

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchContent: '',
            usersResults: [],
            is_show_dropdown: false,
        }
        this.onSearchChange = this.onSearchChange.bind(this);
        this.renderUserList = this.renderUserList.bind(this);
        this.onFollowClicked = this.onFollowClicked.bind(this);
        this.isFriended = this.isFriended.bind(this);
        this.goToUserProfile = this.goToUserProfile.bind(this);
    }


    findUser(name, userList) {
        let result = userList.filter(user => {
            return user.username.toLowerCase().includes(name.toLowerCase());
        })
        console.log(result);
        return result;
    }

    onSearchChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
        if(e.target.value !== '') {
            const users = this.findUser(e.target.value, this.props.allUser);
            if(users) {
                if (users !== this.state.usersResults) {
                    this.setState({
                        usersResults: users,
                    })
                }
            } else {
                this.setState({
                    usersResults: [],
                }) 
            }
        }  else {
            this.setState({
                usersResults: [],
            }) 
        }
    }


    onFollowClicked(user) {
        const couple_id = {
            user1_id: this.props.thisUser._id,
            user2_id: user._id
        }
        axios.post('/api/user/addfriend', couple_id)
            .then(res => {
                const {success} = res.data;
                if(success) {
                    //fetch current user => Update after add friend.
                    axios.post('/api/user/me', { email: this.props.thisUser.email})
                        .then(res => {
                            const { token } = res.data;
                            localStorage.setItem('jwtToken', token);
                            setAuthToken(token);
                            const decoded = jwt_decode(token);
                            console.log(decoded);
                            this.props.setCurrentUser(decoded);
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    onUnfollowClicked(user) {
        const couple_id = {
            user1_id: this.props.thisUser._id,
            user2_id: user._id
        }
        axios.post('/api/user/unfriend', couple_id)
            .then(res => {
                console.log(res.data.message)
                if(res.data.success) {
                    //fetch current user => Update after add friend.
                    axios.post('/api/user/me', { email: this.props.thisUser.email})
                        .then(res => {
                            const { token } = res.data;
                            localStorage.setItem('jwtToken', token);
                            setAuthToken(token);
                            const decoded = jwt_decode(token);
                            this.props.setCurrentUser(decoded);
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    goToUserProfile(usernamwe) {
        this.setState({
            usersResults: [],
            searchContent: ''
        }) 
        this.props.history.push(`/profile/${usernamwe}`);
    }

    isFriended(user){
        return this.props.thisUser.friend_list.includes(user._id) ? true : false
    }

    renderUserList(usersResults) {
        return usersResults.map((user, index) => {
            if (this.isFriended(user)) {
                return (
                    <div className="user-detail-wrapper" key={index} href="#">
                        <div className="custom-wrapper" onClick={() => this.goToUserProfile(user.username)}> 
                            <img src={user.avatar} alt={user.username} title={user.username}
                                    className="rounded-circle"
                                    style={{ width: '30px', height: '30px', margin: '5px'}} />
                            <div className="user-name">
                                {user.username}
                            </div>
                        </div>
                        <button className="friended-button" onClick={() => this.onUnfollowClicked(user)}>
                            Friend
                        </button>
                    </div>
                )
            } else { 
                return (
                    <a className="user-detail-wrapper" key={index} href="#">
                        <div className="custom-wrapper"> 
                            <img src={user.avatar} alt={user.username} title={user.username}
                                    className="rounded-circle"
                                    style={{ width: '30px', height: '30px', margin: '5px'}} />
                            <div className="user-name">
                                {user.username}
                            </div>
                        </div>
                        <button className="addfriend-button" onClick={() => this.onFollowClicked(user)}>
                            Follow
                        </button>
                    </a>
                )
            }
        })
    }

    render() {
        const listUser = this.renderUserList(this.state.usersResults)

        return (
            <div className="search-wrapper">
                <input className="searchbar" type="text" autoCapitalize="none" placeholder="Search" value={this.state.searchContent} name="searchContent"
                        onChange={this.onSearchChange} ref={node => this.node = node}/> 
                <div className="user-result-list-wrapper">
                    {(this.state.usersResults.length != 0 && this.state.searchContent !== '') ? <div className="user-result-list">{listUser}</div> : <div></div>}    
                </div>   
            </div>
        )
    }
}



export default withRouter(SearchBar);