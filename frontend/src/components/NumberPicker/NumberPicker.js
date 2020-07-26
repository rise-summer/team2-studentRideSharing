import React from 'react';
import '../../App.css';
{/*import searchbar.css? */}

function NumberPicker(props) {
    let val = props.value;
    // Prevents empty string being assigned to value
    const numericalValue = !val && val !== 0 ? '' : val;
    return (
        <div className="inputwrapper">
            <input
                className="inputbox"
                type="number"
                min={props.min}
                max={props.max}
                step={props.step}
                name={props.name}
                placeholder={props.placeholder}
                value={numericalValue}
                onChange={props.editfn}
                required={props.required}
            />
        </div>
    );
}

export default NumberPicker;
