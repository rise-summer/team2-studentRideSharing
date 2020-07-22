import React from 'react';
import '../../App.css';

function TimePicker(props) {
    return (
        <div className="inputwrapper">
            <input className="inputbox" type="time" name={props.name} value={props.value} onChange={props.editfn} />
        </div>
    );
}

export default TimePicker;
