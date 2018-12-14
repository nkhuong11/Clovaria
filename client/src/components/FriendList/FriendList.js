import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FriendDetail from './FriendDetail';
import '../css/FriendList.css';

class FriendList extends Component {
    render(){
        return (
            <div className="friend-list-container">
                <FriendDetail/>
                <FriendDetail/>
                <FriendDetail/>
            </div>
        );
    }
}

// FriendList.propTypes = {
//     logoutUser: PropTypes.func.isRequired,
//     getAllUsers: PropTypes.func.isRequired,
//     auth: PropTypes.object.isRequired
// }

const mapStateToProps = (state) => ({
    auth: state.auth,
    allUser: state.allData.all_users
})

export default connect(mapStateToProps)(FriendList);
