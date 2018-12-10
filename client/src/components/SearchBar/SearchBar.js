import React, { Component } from 'react';

import '../css/Searchbar.css'

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchContent: '',
            usersResults: []
        }
        this.onSearchChange = this.onSearchChange.bind(this);
        this.renderUserList = this.renderUserList.bind(this);
    }

    findUser(name, userList) {
        let result = userList.filter(user => {
            return user.username.toLowerCase().includes(name.toLowerCase());
        })
        return result;
    }

    onSearchChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
        if(e.target.value !== '') {
            const users = this.findUser(e.target.value, this.props.allUser);
            //console.log(users)
            if(users) {
                if (users !== this.state.usersResults) {
                    this.setState({
                        usersResults: users
                    })
                }
            } else {
                this.setState({
                    usersResults: []
                }) 
            }
        }  else {
            this.setState({
                usersResults: []
            }) 
        }
    }

    renderUserList(usersResults) {
        return usersResults.map((user, index) => 
            <a className="user-detail-wrapper" key={index} href="#">
                <div className="custom-wrapper"> 
                    <img src={user.avatar} alt={user.username} title={user.username}
                            className="rounded-circle"
                            style={{ width: '30px', height: '30px', margin: '5px'}} />
                    <div className="user-name">
                        {user.username}
                    </div>
                </div>
                <button className="addfriend-button" onClick={() => console.log('das')}>
                    Follow
                </button>
            </a>
        )
    }

    render() {
        const listUser = this.renderUserList(this.state.usersResults)

        return (
            <div className="search-wrapper">
                <input className="searchbar" type="text" autoCapitalize="none" placeholder="Search" value={this.state.searchContent} name="searchContent"
                        onChange={this.onSearchChange}/> 
                <div className="user-result-list-wrapper">
                    {(this.state.usersResults.length != 0) ? <div className="user-result-list">{listUser}</div> : <div></div>}    
                </div>   
            </div>
        )
    }
}

export default SearchBar;