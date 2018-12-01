import React, {Component } from 'react';

import { connect } from 'react-redux';

import './css/ProfilePage.css';

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(avatar) {
        console.log(avatar);
    }

    componentDidMount() {
        if(!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
            console.log(this.props.auth)
        }
    }
    
    render() {
        const { username, id, email, avatar } = this.props.auth.user;

        return (
            <div>
               <header className="profile-header-container">
                   <div className="XjzKX">
                        <div className="avatar-container">
                            <div className="avatar-image">
                                <button className="XoHvYU" title="Change Profile Photo" onClick={() => this.onClick(avatar)}>
                                    <img className="XoHvYU be6sR" alt="Change Profile Photo" src={avatar}/>
                                </button>
                            </div>
                        </div>
                   </div>
                   <section>
                        <div style={{marginBottom: '20px'}}>
                            <h1 className="fDxYl">{username}</h1>
                        </div>
                   </section>
               </header>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

export default connect(mapStateToProps)(ProfilePage)