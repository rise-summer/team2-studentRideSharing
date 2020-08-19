import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/src/mapbox-gl-directions.css';
import Loader from 'semantic-ui-react';

mapboxgl.accessToken =
    'pk.eyJ1IjoicmlzZXRlYW0yIiwiYSI6ImNrZDIzdDJkbjBzcnEyc3E5YnViazdoYWEifQ.6O1AdDa4j5XR9qSRWMkcWQ';

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: -99,
            lat: 40,
            zoom: 2.5,
            directionObject: null,
        };
        this.mapRef = React.createRef();
    }
    componentDidMount() {
        console.log(this.props.origin);
        const map = new mapboxgl.Map({
            container: this.mapRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom,
        });

        const directions = new MapboxDirections({
            profile: 'mapbox/driving',
            interactive: false,
            controls: {
                inputs: false,
                instructions: false,
                profileSwitcher: false,
            },
            accessToken: mapboxgl.accessToken,
        });
        map.addControl(directions);
        this.setState({ directionObject: directions });
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.origin !== this.props.origin ||
            prevProps.destination !== this.props.destination
        ) {
            const { origin, destination } = this.props;
            if (origin.length > 0 && destination.length > 0) {
                this.state.directionObject.setOrigin(origin);
                this.state.directionObject.setDestination(destination);
            }
        }
    }
    render() {
        return (
            <div className="mapWrapper">
                <div className="mapContainer" ref={this.mapRef}></div>
            </div>
        );
    }
}

export default Map;
