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
                center: {lat: 25, lng: 25},
                zoom: 3
            },
            googleMapsIsReady: false,
            overlays: null,
            selectedPosition: null
        };

        this.onMapReady = this.onMapReady.bind(this);
        this.onOverlayClick = this.onOverlayClick.bind(this);
    }


    componentDidUpdate (prevProps, prevState, snapshot) {
        if (this.props.locatedTweets !== prevProps.locatedTweets) {
            this.setOverlay(this.props.locatedTweets);
        }
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
        this.setOverlay();
    }

    onOverlayClick(event) {
        let isMarker = event.overlay.getTitle !== undefined;

        if(isMarker) {
            this.toggleBounce(event.overlay);
            let tweet = JSON.parse(event.overlay.getTitle());
            this.infoWindow = this.infoWindow||new google.maps.InfoWindow();
            this.infoWindow.setContent('<div>' + `${tweet.user_name}@${tweet.user_location}` + '</div>');
            this.infoWindow.open(event.map, event.overlay);
            event.map.setCenter(event.overlay.getPosition());
            this.props.onMarkerClick(tweet.id);
        }
    }

    toggleBounce(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 1300);
    }

    setOverlay(locatedTweets) {
        const overlays = [];
        if (locatedTweets) {
            locatedTweets.forEach((tweet) => {
                if (tweet.coordinates) {
                    overlays.push(new google.maps.Marker({
                        position: {
                            lat: tweet.coordinates.lat,
                            lng: tweet.coordinates.lng
                        },
                        title: JSON.stringify(tweet),
                        animation: google.maps.Animation.DROP,
                    }))
                }
            });
        }
        this.setState({overlays});
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
