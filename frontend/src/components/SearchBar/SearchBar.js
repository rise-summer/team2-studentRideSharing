import React, {Component} from 'react';
import '../../App.css';
import './SearchBar.css';

class SearchBar extends Component {
    render() {
        return (
            <div className='inputwrapper'>
                <input
                    className='inputbox'
                    type='text'
                    value={this.props.dest}
                    onChange={this.props.editfn}
                    placeholder={this.props.placeholder}
                />
            </div>
        );
    }
}

export default SearchBar;
