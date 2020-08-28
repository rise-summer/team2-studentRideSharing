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
        console.log(this.props);
        this.state = {
            rides: {
                outboundRides: [],
                returnRides: []
            },
        };
    }

    handleChange = (e, { value }) => {
        this.setState({ value });
        this.sort(value);
        // this.props.sort(this.state.rides);
    }

    sort = (sortType) => {
        let sortOutbound;
        let sortReturn;
        if (sortType === '-1') {
            sortOutbound = this.props.rides.outboundRides.sort((a, b) => {
                return Date.parse(b.time) - Date.parse(a.time);
            })
            sortReturn = this.props.rides.returnRides.sort((a, b) => {
                return Date.parse(b.time) - Date.parse(a.time);
            })
            this.setState({
                rides: {
                    outboundRides: sortOutbound,
                    returnRides: sortReturn,
                }
            })
        }
        else if (sortType === '1') {
            sortOutbound = this.state.rides.outboundRides.sort((a, b) => {
                return Date.parse(a.time) - Date.parse(b.time);
            })
            sortReturn = this.state.rides.returnRides.sort((a, b) => {
                return Date.parse(a.time) - Date.parse(b.time);
            })
            this.setState({
                rides: {
                    outboundRides: sortOutbound,
                    returnRides: sortReturn,
                }
            })
        }
    };

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

const mapStateToProps = (state) => ({
    rides: state.rides,
});

export default connect(mapStateToProps)(SortBy);

