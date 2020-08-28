import React from 'react';
import { connect } from 'react-redux';
import DriverListing from '../../components/CreateRideComponents/DriverListing';

/* makes info from redux store available as prop for this component
*   - loggedIn: accessible via this.props.loggedIn
*   - uid: accessible via this.props.uid
* */
const mapStateToProps = (state) => ({
    loggedIn: state.loggedIn,
    uid: state.uid,
});

class CreateRide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            haveInfo: true
        };
    }

    //Check to see if Driver have vehicle infomation
    async componentDidMount() {
        await fetch(`/api/vehicles/${this.props.uid}`, {
            method: 'GET'
        }).then(response => {
            if (response.status === 200) {
                this.setState({ haveInfo: true });
            }
        });
    }

    render() {
        const { haveInfo } = this.state;
        //sent check to DriverListing component as props
        return < DriverListing uid={this.props.uid} haveCarInfo={haveInfo} />;
    }
}

export default connect(mapStateToProps)(CreateRide);