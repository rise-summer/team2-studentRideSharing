import React from 'react';
import './App.css';
import DriverListing from './pages/DriverListing';
import Search from './pages/Search/Search';
import Signin from './pages/Signin';
import Signup from './pages/Signup';

function App() {
    return (
        <div className="App">
            <Signin />
            <Signup />
        </div>
    );
}

export default App;
