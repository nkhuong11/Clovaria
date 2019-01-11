import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

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

        this.props.socket.on('UPDATE NEW POST SIGNAL', (data) => {
            this.updatePost(data.post);
        })
    }
    
    componentWillMount() {
        if(!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
        } else {}
    }

    componentDidMount() {
        axios.get(`/api/get/posts/${this.props.auth.user._id}`)
        .then(res => {
            console.log(res.data);
            // const friend_post = res.data.posts;
            this.setState({
                posts: res.data.posts
            });
        })
    }
    

    onProfileClick() {
        this.props.history.push(`/profile/${this.props.auth.user.username}`);
    }

    updatePost(post){
        this.setState(prevState => ({
            posts: [post, ...prevState.posts]
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