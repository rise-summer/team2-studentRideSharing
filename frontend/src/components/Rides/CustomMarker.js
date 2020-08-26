import React from 'react';
import { Label, Icon } from 'semantic-ui-react';

const CustomMarker = (props) => {
    return (
        <Label circular color="blue" size="large" pointing="below">
            <Icon.Group>
                <Icon name={props.icon} />
            </Icon.Group>
            {props.content}
        </Label>
    );
};

export default CustomMarker;
