import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { isEqual } from 'lodash';
// import CustomMarker from './CustomMarker';
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

    componentDidUpdate(prevProps) {
        const newWaypoints = this.props.waypoints;
        // Only runs this part if the route changes
        if (!isEqual(prevProps.waypoints, newWaypoints)) {
            const { lineString } = this.props;
            const map = this.state.mapObject;
            this.clearAllMarkers();

            const data = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: lineString,
                },
            };

            if (map.getSource('route')) {
                map.getSource('route').setData(data);
            } else {
                map.addSource('route', {
                    type: 'geojson',
                    data: data,
                });
                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round',
                    },
                    paint: {
                        'line-color': '#888',
                        'line-width': 8,
                    },
                });
            }

            const markers = [];
            
            newWaypoints.forEach((waypoint, index) => {
                // const markerContainer = document.createElement('div');
                const markerContainer = null;
                const marker = new mapboxgl.Marker(markerContainer)
                    .setLngLat(waypoint)
                    .addTo(map);

                // ReactDOM.render(
                //     React.createElement(CustomMarker, {
                //         content: sampleData[index].content,
                //         icon: sampleData[index].icon,
                //     }),
                //     markerContainer
                // );

                // const popup = new mapboxgl.Popup().setText((index + 1));
                // marker.setPopup(popup);

                markers.push(marker);
            });

            this.setState({
                currentMarkers: markers,
            });

            // https://docs.mapbox.com/mapbox-gl-js/example/zoomto-linestring/
            const nth = 10;
            const bounds = lineString
                .filter((e, i) => i % nth === nth - 1)
                .reduce(function (bound, coord) {
                    return bound.extend(coord);
                }, new mapboxgl.LngLatBounds(lineString[0], lineString[0]));

            map.fitBounds(bounds, {
                padding: 20,
            });
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
