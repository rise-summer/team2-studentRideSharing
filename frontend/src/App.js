import React from 'react';
import './App.css';
import DriverListing from './pages/DriverListing';
import Search from './pages/Search/Search';
import {Router, Switch, MemoryRouter, Route} from 'react-router-dom';
import RideDetails from './pages/RideDetails/RideDetails';
import {createBrowserHistory} from "history";

const history = createBrowserHistory();
import Signin from './pages/Signin';
import Signup from './pages/Signup';

function App() {
    return (
        <div className="App">
            {/*<RideDetails/>*/}
            {/*<Search/>*/}
            <Router initialEntries={['/']} initialIndex={0} history={history}>
                <Switch>
                    <Route exact path="/">
                        <Search/>
                    </Route>
                    <Route path="/search">
                        <Search/>
                    </Route>
                    <Route path="/ride">
                        <RideDetails/>
                    </Route>
                </Switch>
            </Router>
            <DriverListing/>
        </div>
    );
}

export default App;
