import React, { Component } from 'react';

import '../css/ChatBox.css'

class InputField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message : '',
        }
        this.onEnterPress = this.onEnterPress.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
    }

    updateInputValue(e) {
        this.setState({
          message: e.target.value
        });
    }

    onEnterPress(e) {
        if (e.key === 'Enter') {
            this.props.onEnterPress(this.state.message);
            this.setState({message: ''})
        }
    }
    
    render() {
        return (
            <input className="chat-input" type="text" 
                            placeholder="Type..."  
                            onKeyPress={(e) => this.onEnterPress(e)}
                            value={this.state.message}
                            onChange={(e) => this.updateInputValue(e)}/>
        );
    }
}

export default InputField;