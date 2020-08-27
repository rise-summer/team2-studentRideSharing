import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './SearchBox';
import './SearchLanding.css';

class SearchLanding extends Component {
    render() {
        return (
            <div className="landing">
                <div className="landing-title">Student Rideshare Search</div>
                <SearchBox
                    // query={this.props.query}
                    functions={this.props.functions}
                    refs={this.props.refs}
                />
            </div>
        );
    }
}

export default SearchLanding;
