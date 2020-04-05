/*global google*/
import React from "react";
import './Map.css';
import {GMap} from 'primereact/gmap';
import ErrorBoundary from './ErrorBoundary';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                center: {lat: 36.890257, lng: 30.707417},
                zoom: 12
            },
            googleMapsIsReady: false,
            overlays: null,
            selectedPosition: null
        };

        this.onMapReady = this.onMapReady.bind(this);
        this.onOverlayClick = this.onOverlayClick.bind(this);
    }

    componentDidMount() {
        this._asyncRequest = loadGoogleMaps(() => {
            // Work to do after the library loads.
            this.setState({ googleMapsIsReady: true });
        });
    }

    componentWillUnmount() {
        if (this._asyncRequest) {
            this._asyncRequest.cancel();
        }
    }

    onMapReady(event) {
        this.setState({
            overlays: [
                new google.maps.Marker({ position: { lat: 36.879466, lng: 30.667648 }, title: "Konyaalti" }),
                new google.maps.Marker({ position: { lat: 36.883707, lng: 30.689216 }, title: "Ataturk Park" }),
                new google.maps.Marker({ position: { lat: 36.885233, lng: 30.702323 }, title: "Oldtown" }),
                new google.maps.Polygon({
                    paths: [
                        { lat: 36.9177, lng: 30.7854 }, { lat: 36.8851, lng: 30.7802 }, { lat: 36.8829, lng: 30.8111 }, { lat: 36.9177, lng: 30.8159 }
                    ], strokeOpacity: 0.5, strokeWeight: 1, fillColor: '#1976D2', fillOpacity: 0.35
                }),
                new google.maps.Circle({ center: { lat: 36.90707, lng: 30.56533 }, fillColor: '#1976D2', fillOpacity: 0.35, strokeWeight: 1, radius: 1500 }),
                new google.maps.Polyline({ path: [{ lat: 36.86149, lng: 30.63743 }, { lat: 36.86341, lng: 30.72463 }], geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2 })
            ]
        })
    }

    onOverlayClick(event) {
        let isMarker = event.overlay.getTitle !== undefined;

        if(isMarker) {
            let title = event.overlay.getTitle();
            this.infoWindow = this.infoWindow||new google.maps.InfoWindow();
            this.infoWindow.setContent('<div>' + title + '</div>');
            this.infoWindow.open(event.map, event.overlay);
            event.map.setCenter(event.overlay.getPosition());
        }
    }

    scriptIsLoad() {
        setTimeout(() => {
            this.setState({ scriptIsLoad: true });
        }, 2000);
    }

    render() {
        if (this.state.googleMapsIsReady === false) {
            return 'Loading GMaps...';
        } else {
            return (
                <ErrorBoundary>
                    <GMap options={this.state.options}
                          overlays={this.state.overlays}
                          onMapReady={this.onMapReady}
                          onOverlayClick={this.onOverlayClick}
                          style={{width: '100%', height: '100%', minWidth: '500px', minHeight: '500px'}}/>
                </ErrorBoundary>
            );
        }
    }
}

const loadGoogleMaps = (callback) => {
    const existingScript = document.getElementById('googleMaps');

    if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDGxP8O43jDgVP6dQsd0qblLvufUxsPhqE&libraries=places';
        script.id = 'googleMaps';
        document.body.appendChild(script);

        script.onload = () => {
            if (callback) callback();
        };
    }

    if (existingScript && callback) callback();
};

export default Map;
