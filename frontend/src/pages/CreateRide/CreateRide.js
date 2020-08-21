import React from 'react';
import DriverListing from '../../components/CreateRideComponents/DriverListing';

class CreateRide extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            haveInfo: true
        };
    }

    async componentDidMount () {
        await fetch(`/api/vehicles/${this.props.userId}`, {
            method: 'GET'
        }).then(response => {
            if(response.status === 200){
                this.setState({ haveInfo: true});
            }
        })
    }

    render(){
        const { haveInfo } = this.state;
        console.log(this.state.haveInfo);
        return < DriverListing userId = { this.props.userId } haveCarInfo = {haveInfo}/>;
    }
}

export default CreateRide;