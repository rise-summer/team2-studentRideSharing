import {getRidesSuccess, getRidesError, getRidesPending} from "../reducers/SearchRidesReducer";

const xurl = '';

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
