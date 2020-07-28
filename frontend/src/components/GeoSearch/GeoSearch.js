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
*/
//need to render map with point of interest?
// add address, city, state field autofilled and allow user to edit it
// store display name (could be address), city, state, optional address in db
// ride listing shows city
// ride detail page shows display name
class GeoSearch extends React.Component {
    constructor(props) {
        super(props);
        // props: has map?

        /* 
        place_type: base place type (e.g. place for San Francisco)
        text: feature name (display name?), if search is address, will be street name
        place_name: feature name with full result hierarchy (e.g. San Francisco, California, United States)
        address: optional, check for address here first, if search is an address, will be a number
        properties.address: optional, check here if not in 'address'
        */

        this.searchRef = React.createRef();
    }

    async componentDidMount() {

        // Code to retreive location for proximity search
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

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            placeholder: this.props.placeholder,
            countries: 'US',
            types:
                'region,postcode,district,place,locality,neighborhood,address,poi',
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
        //need to render map with point of interest?
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
