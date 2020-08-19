import React, { Component } from "react";
import "./Ride.css";
import { Accordion, Icon } from "semantic-ui-react";
import { Link } from 'react-router-dom';

class Ride extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: -1
        }
    }

    formatTime = (t) => {
        const year = t.getFullYear();
        const month = t.getMonth() + 1;
        const date = t.getDate();
        var hour = t.getHours();

        var mins = t.getMinutes();
        if (mins < 10) {
            mins = "0" + mins;
        }
        const period = (hour < 12) ? "AM" : "PM";
        if (hour > 12) {
            hour -= 12;
        }

        return month + "-" + date + "-" + year + " at " + hour + ":" + mins + " " + period;
    };

    handleClick = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;
        this.setState({activeIndex: newIndex})
    };

    render() {
        const { start, dest, driverID, rideID } = this.props;
        return (
            <div className="ride">
                <Accordion className="accordion">
                    <Accordion.Title
                        className="accordion-title"
                        active={this.state.activeIndex === 0}
                        index={0}
                        onClick={this.handleClick}>
                        From: {start + " | "}
                        To: {dest}
                        <Icon name="dropdown" className="dropdown-icon" />
                    </Accordion.Title>
                    <Accordion.Content
                        className="accordion-dropdown"
                        active={this.state.activeIndex === 0}>
                        <b>Departure Time: {this.formatTime(this.props.time)}</b>
                        <Link to={`/ride/${driverID}/${rideID}`}>
                            <button className="view-button">View Ride</button>
                        </Link>
                    </Accordion.Content>
                </Accordion>
                {/*<div><b>Departing From: {this.props.start}</b></div>*/}
                {/*<div><b>Departure Time: {this.formatTime(this.props.time)}</b></div>*/}
                {/*<div><b>Destination: {this.props.dest}</b></div>*/}

            </div>
        )
    }
}

export default Ride;
