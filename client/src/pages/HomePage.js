import React, { Component } from 'react';
import { connect } from 'react-redux';

import FriendList from '../components/FriendList/FriendList';
import './css/HomePage.css'

class HomePage extends Component {
    constructor(props) {
        super(props);
        
    }
    
    componentWillMount() {
        if(!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
        }
        console.log('HOME PAGE')
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