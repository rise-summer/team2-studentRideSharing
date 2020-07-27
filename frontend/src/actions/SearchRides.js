import {getRidesSuccess, getRidesError, getRidesPending} from "../reducers/SearchRidesReducer";

const xurl = 'http://localhost:5000/api/rides?query=%7B%22originCoords%22%3A%5B-119.159392%2C34.164958%5D%2C%22beginDate%22%3A%222020-07-23T20%3A00%3A00.000Z%22%2C%22endDate%22%3A%222020-07-23T21%3A00%3A00.000Z%22%2C%22distance%22%3A5%7D'

function getRides() {
    return dispatch => {
        dispatch(getRidesPending());
        fetch(xurl)
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw(res.error);
                }
                console.log(res); /*****/
                dispatch(getRidesSuccess(res.rides));
                return res.rides;
            })
            .catch(error => {
                dispatch(getRidesError(error));
            })
    }
}

export default getRides;
