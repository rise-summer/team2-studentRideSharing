import React, { Component } from "react";
import './Ride.css';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Ride extends Component {
    constructor(props) {
        super(props);
        this.state = {
            driver: {
                name: '',
                school: '',
                photoURL: ''
            }
        }
    }

    componentWillMount() {
        this.getUserInfo(this.props.driverID);
    }

    getUserInfo = (driverID) => {
        const userURL = '/api/users/' + driverID;
        const requestOptions = {
            method: 'GET',
        };
        fetch(userURL)
            .then((res) => res.json())
            .then((driver) => {
                let driverInfo = this.state.driver;
                driverInfo.name = driver.firstName + " " + driver.lastName;
                driverInfo.school = driver.school;
                driverInfo.photoURL = driver.photoURL;
                this.setState({ driver: driverInfo });
            })
            .catch(error => console.log('error: ', error));
    };

    formatDate = (t) => {
        const year = t.getFullYear();
        const month = t.getMonth() + 1;
        const date = t.getDate();
        return month + "-" + date + "-" + year;
    };

    formatTime = (t) => {
        // const year = t.getFullYear();
        // const month = t.getMonth() + 1;
        // const date = t.getDate();
        var hour = t.getHours();

        var mins = t.getMinutes();
        if (mins < 10) {
            mins = "0" + mins;
        }
        const period = (hour < 12) ? "AM" : "PM";
        if (hour > 12) {
            hour -= 12;
        }
        if (hour === 0) {
            hour = 12;
        }

        // return month + "-" + date + "-" + year + " at " + hour + ":" + mins + " " + period;
        return hour + ":" + mins + " " + period;
    };

    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;
        this.setState({ activeIndex: newIndex })
    };

    render() {
        const { start, dest, driverID, rideID } = this.props;
        return (
            <div className="ride">
                <div className="profile">
                    <img
                        className="profile-pic"
                        alt="Profile Picture"
                        src={this.state.driver.photoURL} />
                </div>
                <div className="info-wrapper">
                    <div className="driver-name">{this.state.driver.name}</div>
                    {/*<div className="driver-name">First Last</div>*/}
                    <div className="school">{this.state.driver.school}</div>
                    <div
                        className="ride-itinerary"
                        onClick={this.handleClick}>
                        {start}
                        <Icon name="long arrow alternate right" className="ride-arrow" />
                        {dest}
                    </div>
                    <div className="ride-time">
                        <Icon name="calendar outline" />
                        <div className="ride-info-item">{this.formatDate(new Date(this.props.time))}</div>
                        <Icon name="clock outline" />
                        <div className="ride-info-item">{this.formatTime(new Date(this.props.time))}</div>
                        <Icon name="user" />
                        <div className="ride-info-item">{this.props.capacity}</div>
                        <Link to={`/ride/${driverID}/${rideID}`}>
                            <button className="view-button">View Ride</button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Ride;
