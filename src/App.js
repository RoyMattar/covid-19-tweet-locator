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
            locatedTweets: []
        };

        this.handleFilterClick = this.handleFilterClick.bind(this);
    }

    handleFilterClick(filterArgs) {
        fetch('http://192.168.1.144:5000/search/', {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filterArgs)
        })
            .then(response => response.json())
            .then(data => this.setState({ locatedTweets: data.locatedTweets}));
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
                        <Map locatedTweets={this.state.locatedTweets}/>
                    </main>
                    <aside id="right-panel">
                        <Results/>
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
