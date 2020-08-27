import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import 'semantic-ui-css/semantic.min.css'
import * as serviceWorker from './serviceWorker';
import { createStore } from "redux";
import { Provider } from "react-redux"
import * as firebase from "firebase";
<<<<<<< HEAD
import 'semantic-ui-less/semantic.less'
=======
require('dotenv').config();
>>>>>>> production

const initialState = {
    start: '',
    endDest: '',
    rides: [
        ['UCI', 'UCB', new Date(2020, 6, 21, 10, 0)],
        ['UCLA', 'UCSD', new Date(2020, 6, 24, 12, 15)],
        ['USC', 'Stanford', new Date(2020, 6, 27, 14, 30)],
    ],
    filteredRides: [],
    startDate: '',
    endDate: '',
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case "SEARCH":
            return {};
        default:
            return state;
    }
}

const store = createStore(reducer);

store.dispatch({
    type: "SEARCH"
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
