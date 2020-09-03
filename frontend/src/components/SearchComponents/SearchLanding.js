import React, { Component } from 'react';
import SearchBox from './SearchBox';
import './SearchLanding.css';
import landing from './landing-graphic.png';
import yellow from './yellow.png';

class SearchLanding extends Component {
    render() {
        return (
            <div className="landing-wrapper">
                <div className="banner">
                    <div className="banner-text">
                        Connect with Students through
                        <div className="orange">{" Ridesharing"}</div>
                    </div>
                    <img alt="yellow car" src={yellow} className="banner-img" />
                </div>

                <div className="landing">
                    <div className="landing-title">Where are you going?</div>
                    <SearchBox
                        functions={this.props.functions}
                        refs={this.props.refs}
                    />
                </div>
                <img alt="landing city" src={landing} className="landing-image" />
            </div>
        );
    }
}

export default SearchLanding;
