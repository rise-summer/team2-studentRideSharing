import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { isEqual } from 'lodash';
import '@mapbox/mapbox-gl-directions/src/mapbox-gl-directions.css';
import 'mapbox-gl/dist/mapbox-gl.css';

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
            mapObject: null,
            currentMarkers: [],
        };
        this.mapRef = React.createRef();
    }
    componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom,
        });

        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2),
            });
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
        this.setState({ mapObject: map });
    }

    clearAllMarkers = () => {
        this.state.currentMarkers.forEach((marker) => marker.remove());
    };

    componentDidUpdate(prevProps) {
        const newWaypoints = this.props.waypoints.reverse();
        if (
            !isEqual(prevProps.waypoints, newWaypoints) ||
            prevProps.origin !== this.props.origin ||
            prevProps.destination !== this.props.destination
        ) {
            const { origin, destination } = this.props;
            if (origin.length > 0 && destination.length > 0) {
                const dir = this.state.directionObject;
                const map = this.state.mapObject;
                dir.removeRoutes();
                this.clearAllMarkers();
                dir.setOrigin(origin);
                dir.setDestination(destination);
                newWaypoints.forEach((waypoint) => {
                    dir.addWaypoint(0, waypoint);
                    const marker = new mapboxgl.Marker().setLngLat(waypoint);
                    marker.addTo(map);
                    this.setState({
                        currentMarkers: [...this.state.currentMarkers, marker],
                    });
                });
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
