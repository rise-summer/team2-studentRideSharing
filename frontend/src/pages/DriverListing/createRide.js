import React from 'react';
import DriverListing from './DriverListing';
import DriverInfo from '../../components/DriverInfo/DriverInfo';

class CreateRide extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            haveInfo: false
        };
    }

    async componentDidMount () {
        await fetch(`/api/vehicles/${this.props.userId}`, {
            method: 'GET'
        }).then(response => {
            console.log(response.status)
            if(response.status === 200){
                this.setState({ haveInfo: true});
            }
        })
    }

    render(){
        // this.getFetch()
        console.log(this.state.haveInfo)
        if(!this.state.haveInfo){
            return <DriverListing userId={this.props.userId}/>;
        } else {
            return <DriverInfo userId={this.props.userId}/>;
        }
    }
}

export default CreateRide;