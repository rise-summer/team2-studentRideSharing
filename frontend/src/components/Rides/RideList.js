import React, { Component } from 'react';
import Ride from "./Ride";
import './RideList.css'

class RideList extends Component {
    render() {
        return (
            <div className='ridelist'>
                {this.props.rides.map((ride, i) =>
                    <Ride start={ride[0]}
                          dest={ride[1]}
                          time={ride[2]}
                          key={i}
                    />)}
            </div>
        )
    }
}

export default RideList;
