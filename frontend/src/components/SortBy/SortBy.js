import React from 'react';
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
    }
    render() {
        return (
            <span>
                <br />
                <br />
                Sort by: <b>{' '}</b>
                <Dropdown
                    inline
                    options={sortByOptions}
                    defaultValue={sortByOptions[0].value}
                />
            </span>
        );
    }
}

export default SortBy;

