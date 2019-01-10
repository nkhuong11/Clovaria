import React, { Component } from "react";

import "../css/Post.css";

class Post extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {owner, image_url, content, loved_by, shared_by} = this.props
        
        
        return <article className="Post" ref="Post">
                <header>
                    <div className="Post-user">
                    <div className="Post-user-avatar">
                        <img src={owner.avatar} alt={owner.username} />
                    </div>
                    <div className="Post-user-nickname">
                        <span>{owner.username}</span>
                    </div>
                    </div>
                </header>
                <div className="Post-image">
                    <div className="Post-image-bg">
                    <img alt={content} src={image_url} />
                    </div>
                </div>
                <div className="Post-caption">
                    <strong>{owner.username}</strong> {content}
                </div>
            </article>;
        }
}
export default Post;