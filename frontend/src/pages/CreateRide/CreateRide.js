import React from 'react';
import { connect } from 'react-redux';
import DriverListing from '../../components/CreateRideComponents/DriverListing';
import DriverInfo from '../../components/CreateRideComponents/DriverInfo';

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

    //TODO: Check response instead of response status
    //Check to see if Driver have vehicle infomation
    async componentDidMount() {
        await fetch(`/api/vehicles/${this.props.uid}`, {
            method: 'GET'
        }).then(response => response.json())
        .then(response => {
            if(!response.length){
                this.setState({ haveInfo: false });
            }
        });
    }

    changeCarInfo = (carInfo) => {
        this.setState({
            haveInfo: carInfo,
        })
    }

    render() {
        const { haveInfo } = this.state;
        if(haveInfo){
            return <DriverListing uid={this.props.uid} />;
        }else {
            return <DriverInfo userId={this.props.uid} changeCarInfo={this.changeCarInfo}/>
        }
    }
}

export default connect(mapStateToProps)(CreateRide);