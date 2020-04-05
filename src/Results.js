import React from "react";
import './Results.css';
import {TwitterTweetEmbed} from 'react-twitter-embed';

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tweetId: '933354946111705097'
        }
    }

    render() {
        return (
            <div className="Results">
                <TwitterTweetEmbed tweetId={this.state.tweetId}/>
            </div>
        );
    }
}

export default Results;
