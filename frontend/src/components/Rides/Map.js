import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { isEqual } from 'lodash';
import '@mapbox/mapbox-gl-directions/src/mapbox-gl-directions.css';
import 'mapbox-gl/dist/mapbox-gl.css';

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

    // Set up mapboxgl objects (map and directions)
    componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom,
        });

        // Updates stored lng/lat on move
        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2),
            });
        });

        // Creates directions object to generate directions
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

    // Removes all markers from the map
    clearAllMarkers = () => {
        this.state.currentMarkers.forEach((marker) => marker.remove());
    };

    // TODO: change directions to optimization api route display
    componentDidUpdate(prevProps) {
        // Reversed because the waypoints are all added at index 0 (in reverse order)
        const newWaypoints = this.props.waypoints;
        // Only runs this part if the route changes
        if (
            !isEqual(prevProps.waypoints, newWaypoints) ||
            !isEqual(prevProps.origin, this.props.origin) ||
            !isEqual(prevProps.dest, this.props.dest)
        ) {
            const { origin, dest } = this.props;
            if (origin.length > 0 && dest.length > 0) {
              console.log(origin.join(',') + ';' + newWaypoints.join(';') + ';' + dest.join(','));
                const dir = this.state.directionObject;
                const map = this.state.mapObject;

                // Removes all routes and markers, then creates new route with markers
                dir.removeRoutes();
                this.clearAllMarkers();
                dir.setOrigin(origin);
                dir.setDestination(dest);
                const markers = [];
                newWaypoints.forEach((waypoint, index) => {
                    dir.addWaypoint(index, waypoint);
                    const marker = new mapboxgl.Marker();
                    marker.setLngLat(waypoint);

                    // const popup = new mapboxgl.Popup().setText((index + 1));
                    // marker.setPopup(popup);

                    marker.addTo(map);
                    markers.push(marker);
                });
                this.setState({
                    currentMarkers: markers,
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
