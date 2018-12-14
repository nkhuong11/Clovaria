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
            console.log(this.props.auth)
        }
    }

    render() {

        return (
            <div className="my-homepage">
                <div>
                    Home Page
                </div>
                <FriendList/>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

export default connect(mapStateToProps)(HomePage)