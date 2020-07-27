import React from 'react';
import './App.css';
import Search from './pages/Search/Search';
import RideDetails from './pages/RideDetails/RideDetails';

function App() {
    return (
        <div className="App">
            <RideDetails/>
            <Search/>
        </div>
    );
}

export default App;
