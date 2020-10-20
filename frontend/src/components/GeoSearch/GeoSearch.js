import React from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
// import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import './GeoSearch.css';

mapboxgl.accessToken =
    'pk.eyJ1IjoicmlzZXRlYW0yIiwiYSI6ImNrZDIzdDJkbjBzcnEyc3E5YnViazdoYWEifQ.6O1AdDa4j5XR9qSRWMkcWQ';

/* TODO:
-Add custom proximity
- Change wrapper to make it work with semantic- possibly use different library? (one without GUI)
- Conceal api key
-Add optional map display
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
        this.state = { geoObject: null };
    }

    processResponse = (resp) => {
        const { context, place_type, place_name, center } = resp;

        // Parses attribute types from resp.context
        const getObj = (name) => context.find((obj) => obj.id.startsWith(name));

        // Address can show up in various places, below searches all of them
        const displayName =
            resp.address && place_type[0] === 'address'
                ? resp.address + ' ' + resp.text
                : resp.text;
        const address = place_name;

        // If query is a place, place will not be in context
        const city = place_type[0] === 'place' ? resp : getObj('place');
        const zip = getObj('postcode');
        const state = getObj('region');

        return {
            lng: center[0],
            lat: center[1],
            address: address,
            city: city ? city.text : '',
            state: state ? state.text : '',
            zip: zip ? zip.text : '',
            displayName: displayName || '',
        };
    };

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            if (this.props.value) {
                this.state.geoObject.query(this.props.value);
            } else {
                this.state.geoObject.clear();
            }
        }
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

        const { placeholder, types, name, handleChange } = this.props;

        // Creates geocoder object
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            placeholder: placeholder,
            countries: 'US',
            types: types,
            minLength: 3,
            proximity: coords,
        });

        // When a result is selected, it will send it via handleChange
        geocoder.on('result', () => {
            handleChange(
                this.processResponse(JSON.parse(geocoder.lastSelected)),
                name
            );
        });
        // TODO: use a callback
        if (this.searchRef.current) {
            geocoder.addTo(this.searchRef.current);
        }

        if (this.props.value) {
            geocoder.query(this.props.value);
        }
        this.setState({ geoObject: geocoder });
    }
    render() {
        return (
            <div
                style={{ width: '100%' }}
                className={this.props.className}
                ref={this.searchRef}
            ></div>
        );
    }
}

export default GeoSearch;
