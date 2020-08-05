export const SEARCH_RIDES_PENDING = 'SEARCH_RIDES_PENDING';
export const SEARCH_RIDES_SUCCESS = 'SEARCH_RIDES_SUCCESS';
export const SEARCH_RIDES_ERROR = 'SEARCH_RIDES_ERROR';

function searchRidesPending() {
    return {
        type: SEARCH_RIDES_PENDING
    }
}

function searchRidesSuccess() {
    return {
        type: SEARCH_RIDES_SUCCESS,
        // rides: rides,
    }
}

function searchRidesError() {
    return {
        type: SEARCH_RIDES_ERROR,
        // error: error,
    }
}
