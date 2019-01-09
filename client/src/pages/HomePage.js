import React, { Component } from 'react';
import { connect } from 'react-redux';

import FriendList from '../components/FriendList/FriendList';
import PostEditor from '../components/PostEditor/PostEditor';
import Post from '../components/Post/Post';
import './css/HomePage.css'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.onProfileClick = this.onProfileClick.bind(this);
       

    }
    
    componentWillMount() {
        if(!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
        } else {}
    }

    onProfileClick() {
        this.props.history.push(`/profile/${this.props.auth.user.username}`);
    }

    render() {
        const {user} = this.props.auth

        return (
            <div className="homepage-container">
                <div className="homepage">
                    <PostEditor/>
                    <div className="homepage-post">
                       <Post/>
                       <Post/>
                       <Post/>
                    </div>
                </div>
                <div > 
                    <div className="user-wrapper">
                        <div onClick={this.onProfileClick}>
                            <img src={user.avatar} alt={user.username} title={user.username}
                                className="rounded-circle user-avatar"/>
                        </div>
                        <div className="bold-text" onClick={this.onProfileClick}>
                            {user.username}
                        </div>
                    </div>
                    <FriendList socket={this.props.socket}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

export default connect(mapStateToProps)(HomePage)