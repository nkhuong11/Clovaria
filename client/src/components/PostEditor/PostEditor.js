import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import ModalWrapper from '../Modal/ModalWrapper';

import '../css/PostEditor.css'

class PostEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            reviewImageURL: '',
            imageURL: '',
            showModal: false,
            showImageReview: false,
        };
        this.onSubmitPost = this.onSubmitPost.bind(this);
        this.updatePostTextValue = this.updatePostTextValue.bind(this);
        this.updateImageURLValue = this.updateImageURLValue.bind(this);
        this.handleToggleModal = this.handleToggleModal.bind(this);
        this.onImageReviewClick = this.onImageReviewClick.bind(this);
        this.onImageSubmitClick = this.onImageSubmitClick.bind(this);
    }

    updatePostTextValue(e) {
        this.setState({
            text: e.target.value
        });
    }

    updateImageURLValue(e) {
        this.setState({
            reviewImageURL: e.target.value
        });
    }

    handleToggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    onSubmitPost() {
        const post = {
            content: this.state.text,
            image_url: this.state.imageURL,
            owner: this.props.user._id 
        }
        axios.post('/api/user/create-post', post)
            .then(res => {
                this.setState({
                    text: '',
                    reviewImageURL: '',
                    imageURL: '',
                });
                if(res.data.success) {
                    this.props.updatePost(res.data.post);

                    this.props.socket.emit('SEND UPDATE POST SIGNAL TO FRIEND', this.props.user.friend_list);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    
    onImageReviewClick() {
        this.setState({ showImageReview: !this.state.showImageReview });
    }

    onImageSubmitClick(){
        this.setState((prevState) => ({
            imageURL: prevState.reviewImageURL,
            showModal: !prevState.showModal,
        }));
    }

    render() {
        return (
            <div className="create-post-wrapper">
                <textarea className="custom-input" type="text" 
                        placeholder="What are you thinking?..."
                        value={this.state.text}
                        onChange={(e) => this.updatePostTextValue(e)}/>
                <hr/>
                <div className="buttons-wrapper">
                    <div className="custom-button" onClick={this.handleToggleModal}>
                        ADD IMAGE
                    </div>
                    <div className="custom-button" onClick={this.onSubmitPost}>
                        CREATE POST
                    </div>
                </div>
                    {
                        this.state.showModal &&
                        <ModalWrapper onCloseRequest={() => this.handleToggleModal()}>
                            <div className="insert-image-modal">
                                <div className="custom-flex-row">
                                    <input className="custom-input" type="text" 
                                            placeholder="Image URL..."
                                            value={this.state.reviewImageURL}
                                            onChange={(e) => this.updateImageURLValue(e)}/>
                                    <div className="buttons-wrapper">
                                        <div className="custom-button-2" onClick={this.onImageReviewClick}>
                                            {!this.state.showImageReview ? "REVIEW": "HIDE"}
                                        </div>
                                        <div className="custom-button-2" onClick={this.onImageSubmitClick} >
                                            SUBMIT
                                        </div>
                                    </div>
                                </div>
                                <hr/>
                                {
                                    this.state.showImageReview && this.state.reviewImageURL !== '' &&
                                    <div>
                                        <img  className="review-image" src={this.state.reviewImageURL}/> 
                                    </div>
                                }
                                
                            </div>
                        </ModalWrapper>
                    }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
})

export default connect(mapStateToProps)(PostEditor);
