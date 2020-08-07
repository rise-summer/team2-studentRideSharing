import React, { Component } from 'react';
import '../../App.css';
import './SearchBar.css';

class SearchBar extends Component {
    render() {
        return (
            <input
                className="inputbox"
                type="text"
                value={this.props.text}
                onChange={this.props.editfn}
                placeholder={this.props.placeholder}
                name={this.props.name}
                required={this.props.required}
            />
        );
    }
}

export default SearchBar;
