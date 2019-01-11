import React, {Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { setCurrentUser } from '../actions/authentication';
import setAuthToken from '../services/setAuthToken';

import ModalWrapper from '../components/Modal/ModalWrapper'
import './css/ProfilePage.css';

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: "",
            email: "",
            username: "",
            _id: "",
            friend_list: [],
            posts: [],
            show_modal: false,
            new_avatar_url: '',
            show_avatar_review: false,
            fetch_data_done: false,
        }
        this.onChangeAvatarClick = this.onChangeAvatarClick.bind(this);
        this.handleToggleModal = this.handleToggleModal.bind(this);
        this.updateAvatarURLValue = this.updateAvatarURLValue.bind(this);
        this.onAvatarReviewClick = this.onAvatarReviewClick.bind(this);
        this.renderProfilePost = this.renderProfilePost.bind(this);
        this.changeAvatar = this.changeAvatar.bind(this);
    }

    updateAvatarURLValue(e) {
        this.setState({
            new_avatar_url: e.target.value
        });
    }

    changeAvatar() {
        axios.post('/api/user/update-avatar', {user_id: this.state._id, avatar_url: this.state.new_avatar_url})
        .then(res => {
            if(res.data.success) {
                this.setState((prevState) => ({
                    imageURL: '',
                    show_modal: false,
                    avatar: res.data.avatar,
                    new_avatar_url: '',
                    show_avatar_review: false,
                }));
                if (this.props.isAuthenticated) {
                    axios.post('/api/user/me', { email: this.props.currentUser.email})
                        .then(res => {
                            console.log('REEEEEEEEEE', res);
                            const { token } = res.data;
                            localStorage.setItem('jwtToken', token);
                            setAuthToken(token);
                            const decoded = jwt_decode(token);
                            this.props.setCurrentUser(decoded);
                    })
                }
            }
        })
        
    }

    onAvatarReviewClick() {
        this.setState({ show_avatar_review: !this.state.show_avatar_review });
    }

    handleToggleModal() {
        this.setState({ show_modal: !this.state.show_modal });
    }

    onChangeAvatarClick() {
        if(this.state._id === this.props.currentUser._id) {
            this.handleToggleModal();
        }
    }

    componentDidMount() {
        const {username} = this.props.match.params
        axios.get(`/api/get/user/${username}`)
            .then(res => {
                if (res.data.success) {
                    const {user} = res.data;
                    this.setState({
                        avatar: user.avatar,
                        email: user.email,
                        username: user.username,
                        _id: user._id,
                        friend_list: user.friend_list,
                        posts: user.posts,
                        fetch_data_done: true,
                    });
                }
            })
            .catch(err => {
                console.log(err)
            })
        // if(!this.props.isAuthenticated) {
        //     this.props.history.push('/login');
        //     console.log(this.props.auth)
        // }
    }

    renderProfilePost() {
        if(this.state.posts.length !== 0) {
            return this.state.posts.map((post, index) => {
                return (
                    <div key={index} className="profile-post">
                            <img className="profile-post-image" src={post.image_url} />
                    </div>
                );
            })
        }
        
    }
    
    render() {
        const { username, avatar, posts, friend_list } = this.state

        return (
            <div className="custom-profile-container">
               <header className="profile-header-container">
                   <div className="XjzKX">
                        <div className="avatar-container">
                            <div className="avatar-image">
                                <div className="XoHvYU" title="Update profile photo" onClick={() => this.onChangeAvatarClick()}>
                                    {this.state.fetch_data_done ? <img className="XoHvYU be6sR" alt="Change Profile Photo" src={avatar}/> :<img className="XoHvYU be6sR" alt="Change Profile Photo" src="http://www.gravatar.com/avatar/75d23af433e0cea4c0e45a56dba18b30?s=200&r=pg&d=mm"/>}
                                </div>
                            </div>
                        </div>
                   </div>
                   <section>
                        {this.state.fetch_data_done ?
                            <div style={{marginBottom: '20px'}}>
                                
                                <h1 className="profile-username">{username}</h1>
                                <div className="profile-body-container">
                                    <div className="text-item">
                                        <strong>{posts.length}</strong> posts
                                    </div>
                                    <div className="text-item">
                                        <strong>{friend_list.length}</strong> friends
                                    </div>
                                </div>
                            </div>
                            :
                            null}
                   </section>
               </header>
               <hr/>
               <div className="profile-posts-container">
                    {this.renderProfilePost()}
               </div>
               <div>
                        { 
                            this.state.show_modal &&
                            <ModalWrapper onCloseRequest={() => this.handleToggleModal()}>
                                <div className="insert-image-modal">
                                <div className="custom-flex-row">
                                    <input className="custom-input" type="text" 
                                            placeholder="Avatar URL..."
                                            value={this.state.new_avatar_url}
                                            onChange={(e) => this.updateAvatarURLValue(e)}/>
                                    <div className="buttons-wrapper">
                                        <div className="custom-button-2" onClick={this.onAvatarReviewClick}>
                                            {!this.state.show_avatar_review ? "REVIEW": "HIDE"}
                                        </div>
                                        <div className="custom-button-2" onClick={this.changeAvatar} >
                                            SUBMIT
                                        </div>
                                    </div>
                                </div>
                                <hr/>
                                {
                                    this.state.show_avatar_review && this.state.new_avatar_url !== '' &&
                                    <div className="center-item">
                                        <img  className="avatar-image-review" src={this.state.new_avatar_url}/> 
                                    </div>
                                }
                                
                            </div>
                            </ModalWrapper>
                        }
               </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth.user,
})

export default connect(mapStateToProps, {setCurrentUser} )(ProfilePage)
