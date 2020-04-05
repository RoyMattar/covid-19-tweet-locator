import React from 'react';
import './App.css';
import Filters from './Filters';
import Map from './Map';
import Results from './Results';
import packageJson from '../package.json';

function App() {
    return (
        <div className="App">
            <header>
                <h1>Covid 911 : Covid-19 Tweet Locator</h1>
            </header>
            <section id="body">
                <aside id="left-panel">
                    <Filters/>
                </aside>
                <main>
                    <Map/>
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

export default App;
