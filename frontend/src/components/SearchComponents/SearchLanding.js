import React, { Component } from 'react';
import SearchBox from './SearchBox';
import './SearchLanding.css';

class SearchLanding extends Component {
    render() {
        return (
            <div className="landing">
                <div className="landing-title">Where are you going?</div>
                <SearchBox
                    functions={this.props.functions}
                    refs={this.props.refs}
                />
            </div>
        );
    }
}

export default SearchLanding;
