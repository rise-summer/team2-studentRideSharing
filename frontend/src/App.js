import React from 'react';
import './App.css';
import Search from './pages/Search/Search';
import {Router, Switch, MemoryRouter, Route} from 'react-router-dom';
import RideDetails from './pages/RideDetails/RideDetails';
import {createBrowserHistory} from "history";

const history = createBrowserHistory();

function App() {
    return (
        <div className="App">
            {/*<RideDetails/>*/}
            {/*<Search/>*/}
            <Router initialEntries={['/']} initialIndex={0} history={history}>
                {/*<div>*/}
                {/*    <Route exact path="/" component={Search}/>*/}
                {/*    <Route exact path="/search" component={Search}/>*/}
                {/*    <Route path="/ride" component={RideDetails}/>*/}
                {/*</div>*/}
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
        </div>
    );
}

export default App;
