import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';

const sortByOptions = [
    {
        key: 'Time Asc',
        text: 'Time Asc',
        value: '1',
        content: 'Time Asc',
    },
    {
        key: 'Time Desc',
        text: 'Time Desc',
        value: '-1',
        content: 'Time Desc',
    },
];

class SortBy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // value: '',
        }
    }

    handleChange = (e, { value }) => {
        this.setState({ value });
        this.props.sort(value);
    }

    render() {
        const { value } = this.state;
        return (
            <span>
                <br />
                <br />
                Sort by: <b>{' '}</b>
                <Dropdown
                    inline
                    options={sortByOptions}
                    defaultValue={sortByOptions[0].value}
                    selection
                    value={value} 
                    onChange={this.handleChange}
                />
            </span>
        );
    }
}

// const mapStateToProps = (state) => ({
//     rides: state.rides,
// });

export default SortBy;

