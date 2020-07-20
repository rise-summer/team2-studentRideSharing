import React, { Component } from 'react';
import '../../App.css';
import './SearchBar.css';

class SearchBar extends Component {
    render() {
        return (
            <div className="inputwrapper">
                <input
                    className="inputbox"
                    type="text"
                    // is value state necessary?
                    value={this.props.text}
                    onChange={this.props.editfn}
                    placeholder={this.props.placeholder}
                    name={this.props.name}
                />
            </div>
        );
    }
}

export default SearchBar;
