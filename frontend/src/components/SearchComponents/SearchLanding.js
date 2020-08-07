import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SearchLanding extends Component {
    render() {
        return (
            <div>
                Search Landing Page
                <br />
                <Link to="/search">
                    Search
                </Link>
            </div>
        );
    }
}

export default SearchLanding;
