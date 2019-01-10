import React, { Component } from 'react';
import { connect } from 'react-redux';

import FriendList from '../components/FriendList/FriendList';
import PostEditor from '../components/PostEditor/PostEditor';
import Post from '../components/Post/Post';
import './css/HomePage.css'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        }
        this.onProfileClick = this.onProfileClick.bind(this);
        this.updatePost = this.updatePost.bind(this);
        this.renderPost = this.renderPost.bind(this);       

        this.props.socket.on('NEW UPDATE POST SIGNAL', (userID) => {
            console.log(userID);
        })
    }
    
    componentWillMount() {
        if(!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
        } else {}
    }

    onProfileClick() {
        this.props.history.push(`/profile/${this.props.auth.user.username}`);
    }

    updatePost(post){
        this.setState(prevState => ({
            posts: [...prevState.posts, post]
        }))
    }

    renderPost() {
        return this.state.posts.map((post, index) => {
            return (
                <Post key={index} owner={post.owner} image_url={post.image_url} content={post.content} loved_by={post.loved_by} shared_by={post.shared_by}/>
            );
        })
    }

    render() {
        const {user} = this.props.auth

        return (
            <div className="homepage-container">
                <div className="homepage">
                    <PostEditor updatePost={this.updatePost} socket={this.props.socket}/>
                    <div className="homepage-post">
                       {this.renderPost()}
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