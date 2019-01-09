import React, {Component } from 'react';

import { connect } from 'react-redux';
import axios from 'axios';

import './css/ProfilePage.css';

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: "",
            email: "",
            username: "",
            _id: "",
            friend_list: []
        }
        this.onClick = this.onClick.bind(this);
    }

    onClick(avatar) {
        console.log(avatar);
    }

    componentDidMount() {
        const {username} = this.props.match.params
        axios.get(`/api/get/user/${username}`)
            .then(res => {
                this.setState({
                    avatar: res.data.user.avatar,
                    email: res.data.user.email,
                    username: res.data.user.username,
                    _id: res.data.user._id,
                    friend_list: res.data.user.friend_list
                })
            })
            .catch(err => {
                console.log(err)
            })
        // if(!this.props.isAuthenticated) {
        //     this.props.history.push('/login');
        //     console.log(this.props.auth)
        // }
    }
    
    render() {
        const { username, _id, email, avatar } = this.state

        return (
            <div>
               <header className="profile-header-container">
                   <div className="XjzKX">
                        <div className="avatar-container">
                            <div className="avatar-image">
                                <button className="XoHvYU" title="Change Profile Photo" onClick={() => this.onClick(avatar)}>
                                    <img className="XoHvYU be6sR" alt="Change Profile Photo" src={avatar}/>
                                </button>
                            </div>
                        </div>
                   </div>
                   <section>
                        <div style={{marginBottom: '20px'}}>
                            <h1 className="fDxYl">{username}</h1>
                        </div>
                   </section>
               </header>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth.user,
})

export default connect(mapStateToProps)(ProfilePage)