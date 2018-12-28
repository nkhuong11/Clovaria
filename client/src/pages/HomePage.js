import React, { Component } from 'react';
import { connect } from 'react-redux';

import FriendList from '../components/FriendList/FriendList';
import './css/HomePage.css'

class HomePage extends Component {
    constructor(props) {
        super(props);
        
    }
    
    componentDidMount() {
        if(!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
            console.log('HOME PAGE', this.props.auth)
        }
        console.log('Socket: ', this.props.socket);
    }

    render() {

        return (
            <div className="homepage-container">
                <div className="homepage">
                    Home Page
                </div>
                <FriendList socket={this.props.socket}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

export default connect(mapStateToProps)(HomePage)