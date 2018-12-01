import React, { Component } from 'react';

import { connect } from 'react-redux';

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
        // console.log(this.props.auth.isAuthenticated)
        // console.log(this.props.auth.user)
        return (
            <div>
                Home Page
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

export default connect(mapStateToProps)(HomePage)