import React from 'react';
import SearchBar from '../components/SearchBar/SearchBar';

{
    /*TODO- add roundtrip option to form ,
roundtrip would make two posts*/
}
class DriverListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startLocation: '',
            startDate: '',
            startTimeFrame: '',
            //change from null
            price: null,
            capacity: null,
            isRoundTrip: false,
            errorMessage: '',
            step: 1,
        };
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value =
            name === 'isRoundTrip' ? event.target.checked : event.target.value;
        this.setState({ [name]: value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        // let err = "";
        // const price = this.state.price;
        // const capacity = this.state.capacity;
        // if (!Number(price)) {
        //   err += "Price must be a number. ";
        // }
        // if (!Number(capacity)) {
        //   err += "Capacity must be a number.";
        // }
        // this.setState({ errorMessage: err });
        // if (!err) {
        //   alert("Submitted " + JSON.stringify(this.state));
        // }
        alert('Submitted ' + JSON.stringify(this.state));
        this.state = {
            startLocation: '',
            startDate: '',
            startTimeFrame: '',
            //change from null
            price: null,
            capacity: null,
            isRoundTrip: false,
            errorMessage: '',
            step: 1,
        };
    };

    render() {
        return (
            <div>
                <h1>Create a Ride</h1>
                <form onSubmit={this.handleSubmit} autoComplete="off">
                    {/* Add label? */}
                    {/* vvv Replace with location picker*/}
                    <SearchBar
                        text={this.state.startLocation}
                        editfn={this.handleChange}
                        placeholder={'Start location'}
                        name={'startLocation'}
                    />
                    {/* vvv Replace with pikaday */}
                    <SearchBar
                        text={this.state.startDate}
                        editfn={this.handleChange}
                        placeholder={'Start date'}
                        name={'startDate'}
                    />
                    {/* Probably replace with pikaday too */}
                    <SearchBar
                        text={this.state.startTimeFrame}
                        editfn={this.handleChange}
                        placeholder={'Start time frame'}
                        name={'startTimeFrame'}
                    />
                    <SearchBar
                        text={this.state.price}
                        editfn={this.handleChange}
                        placeholder={'Price'}
                        name={'price'}
                    />
                    <SearchBar
                        text={this.state.capacity}
                        editfn={this.handleChange}
                        placeholder={'Capacity'}
                        name={'capacity'}
                    />
                    <label>
                        Round Trip
                        <input
                            type="checkbox"
                            name="isRoundTrip"
                            onChange={this.handleChange}
                            checked={this.state.isRoundTrip}
                        />
                    </label>
                    <br />
                    <input
                        type="submit"
                        value={this.state.isRoundTrip ? 'Continue' : 'Submit'}
                    />
                </form>
            </div>
        );
    }
}

export default DriverListing;
