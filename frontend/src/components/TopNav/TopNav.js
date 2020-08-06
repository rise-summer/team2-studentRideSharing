import React, {Component} from 'react';
import {Menu} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import './TopNav.css';

class TopNav extends Component {
    state = {};

    handleItemClick = (e, {name}) => this.setState({activeItem: name});

    render() {
        const {activeItem} = this.state;

        return (
            <div className="menu">
                <Menu compact="true">
                    <Link to="/login">
                        <Menu.Item name="login" active={activeItem === "login"}>
                            Log In
                        </Menu.Item>
                    </Link>
                    <Link to="/search">
                        <Menu.Item name="login" active={activeItem === "search"}>
                            Search
                        </Menu.Item>
                    </Link>
                </Menu>
            </div>
        )
    }
}

export default TopNav;
