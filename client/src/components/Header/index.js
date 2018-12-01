import React, {Component} from "react";

//CSS
import "./Header.css";

//Components
import SearchBar from './SeachBar';

class Header extends Component{
    render(){
        return (
            <nav className="Nav">
                <div className="Nav-menus">
                    <div className="Nav-brand">
                        <a className="Nav-brand-logo" href="/">Clovaria</a>
                    </div>
                    <SearchBar/>
                    <div>
                        <a className="Nav-profile" href="/"/>
                    </div>
                </div>
            </nav>
        );
    }   
}

export default Header;