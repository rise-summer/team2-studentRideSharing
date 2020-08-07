import { SEARCH_RIDES_ERROR, SEARCH_RIDES_SUCCESS, SEARCH_RIDES_PENDING } from "../actions/SearchPageStates";

const initialState = {
    pending: false,
    rides: [],
    error: null,
};

export function ridesReducer(state = initialState, action) {
    switch (action.type) {
        case SEARCH_RIDES_PENDING:
            return {
                ...state,
                pending: true
            };
        case SEARCH_RIDES_SUCCESS:
            return {
                ...state,
                rides: action.payload
            };
        case SEARCH_RIDES_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
}

export const getRidesSuccess = state => state.rides;
export const getRidesPending = state => state.pending;
export const getRidesError = state => state.error;
