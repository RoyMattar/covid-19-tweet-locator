import React from 'react';
import './App.css';
import Filters from './Filters';
import Map from './Map';
import Results from './Results';
import packageJson from '../package.json';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locatedTweets: [],
            currentTweetId: null
        };
        this.handleFilterClick = this.handleFilterClick.bind(this);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
    }

    componentDidMount() {
        this.searchPostRequest({});
    }

    handleFilterClick(filterArgs) {
        this.searchPostRequest(filterArgs);
    }

    handleMarkerClick(tweetId) {
        this.setState({currentTweetId: tweetId});
    }

    searchPostRequest(filterArgs) {
        const body = {...filterArgs, radius: "10000km", coordinates: {lat: 25, lng: 25}};
        fetch('http://localhost:5000/search', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then(data => this.setState({ locatedTweets: data.results}))
            .catch((error) => console.error(error));
    }

    render() {
        return (
            <div className="App">
                <header>
                    <h1>Covid 911 : Covid-19 Tweet Locator</h1>
                </header>
                <section id="body">
                    <aside id="left-panel">
                        <Filters onFilterClick={this.handleFilterClick}/>
                    </aside>
                    <main>
                        <Map locatedTweets={this.state.locatedTweets}
                             onMarkerClick={this.handleMarkerClick}/>
                    </main>
                    <aside id="right-panel">
                        <Results currentTweetId={this.state.currentTweetId}/>
                    </aside>
                </section>
                <footer>
                    v{packageJson.version}
                </footer>
            </div>
        );
    }
}

export default App;
