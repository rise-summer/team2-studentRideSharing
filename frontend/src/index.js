import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'semantic-ui-css/semantic.min.css'
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import * as firebase from 'firebase';
import moment from 'moment';

const initialState = {
    rides: {
        outboundRides: [],
        returnRides: []
    },
    roundtrip: false,
    searched: false,
    query: {
        start: null,
        endDest: null,
        beginDate: '',
        endDate: '',
        originCoords: '',
        destCoords: '',
        time: '',
        distance: '',
    },
    loggedIn: false,
    uid: ''
};

function reducer(state = initialState, action) {
    // console.log(action);
    switch (action.type) {
        case 'EDIT_BEGIN_DATE':
            return {
                ...state,
                query: action.value
            };
        case 'EDIT_END_DATE':
            return {
                ...state,
                query: action.value
            };
        case 'UPDATE_RIDES':
            return {
                ...state,
            };
        case 'UPDATE_GEO':
            return {
                ...state,
                query: action.value
            };
        case 'CHANGE_RIDE_TYPE':
            return {
                ...state,
            };
        case 'UPDATE_AUTH_STATUS':
            return {
                ...state,
                loggedIn: action.loggedIn,
                uid: action.uid,
            };
        default:
            return state;
    }
}

export const store = createStore(reducer);

store.dispatch({
    type: 'SEARCH'
});

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
