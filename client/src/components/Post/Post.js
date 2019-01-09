import React, { Component } from "react";

import "../css/Post.css";

class Post extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const nickname = "Admin",
                avatar = "https://www.gravatar.com/avatar/75d23af433e0ce", 
                image = "https://pbs.twimg.com/media/DMDIKcyWsAEsKDj.jpg",
                caption = "This is my post"
        
        
        return <article className="Post" ref="Post">
                <header>
                    <div className="Post-user">
                    <div className="Post-user-avatar">
                        <img src={avatar} alt={nickname} />
                    </div>
                    <div className="Post-user-nickname">
                        <span>{nickname}</span>
                    </div>
                    </div>
                </header>
                <div className="Post-image">
                    <div className="Post-image-bg">
                    <img alt={caption} src={image} />
                    </div>
                </div>
                <div className="Post-caption">
                    <strong>{nickname}</strong> {caption}
                </div>
            </article>;
        }
}
export default Post;