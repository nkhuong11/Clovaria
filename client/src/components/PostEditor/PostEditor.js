import React, { Component } from 'react';

import '../css/PostEditor.css'

class PostEditor extends Component {
    render() {
        return (
            <div className="create-post-wrapper">
                <textarea className="custom-input" type="text" placeholder="What are you thinking? ..."/>
                <hr/>
                <div className="create-post-buttons">
                    <div className="custom-button">
                        ADD IMAGE
                    </div>
                    <div className="custom-button">
                        CREATE POST
                    </div>
                </div>
            </div>
        );
    }
}

export default PostEditor;
