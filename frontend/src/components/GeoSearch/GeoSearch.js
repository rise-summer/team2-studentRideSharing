import React from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken =
    'pk.eyJ1IjoicmlzZXRlYW0yIiwiYSI6ImNrZDIzdDJkbjBzcnEyc3E5YnViazdoYWEifQ.6O1AdDa4j5XR9qSRWMkcWQ';

/* TODO:
- Conceal api key
-Add optional map display
-Add debouncing
-Add ability to change value (for prefilling on round trip) (setInput)
-add required prop
-Make it look good with css
-Add proptypes/documentation
-Add address, city, state field autofilled and allow user to edit it?
- Add types as prop
*/

//need to render map with point of interest?
class GeoSearch extends React.Component {
    constructor(props) {
        super(props);
        this.searchRef = React.createRef();
    }

    async componentDidMount() {
        // Code to retrieve location for proximity search
        let coords;
        if (navigator.geolocation) {
            const getCoordinates = async () => {
                return new Promise(function (resolve, reject) {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
            };
            try {
                const position = await getCoordinates();
                coords = {
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude,
                };
            } catch (error) {
                console.log(error);
            }
        }
        console.log(this.props.types);
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            placeholder: this.props.placeholder,
            countries: 'US',
            types: this.props.types,
            minLength: 3,
            proximity: coords,
        });
        geocoder.on('result', () =>
            this.props.handleChange(
                JSON.parse(geocoder.lastSelected),
                this.props.name
            )
        );
        geocoder.addTo(this.searchRef.current);
    }
    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: '0.5em',
                }}
            >
                <div ref={this.searchRef}></div>
            </div>
        );
    }
}

export default GeoSearch;
