import React from 'react';
import './App.css';
import DriverListing from './pages/DriverListing';
import Search from './pages/Search/Search';
import {Router, Switch, Route} from 'react-router-dom';
import RideDetails from './pages/RideDetails/RideDetails';
import {createBrowserHistory} from "history";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

const history = createBrowserHistory();

function App() {
    return (
        <div className="App">
            <Router initialEntries={['/']} initialIndex={0} history={history}>
                <Switch>
                    <Route exact path="/"><SignIn/></Route>
                    <Route path="/search"><Search/></Route>
                    <Route path="/ride"><RideDetails/></Route>
                    <Route path="/newride"><DriverListing/></Route>
                    <Route path="/signin"><SignIn/></Route>
                    <Route path="/signup"><SignUp/></Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
