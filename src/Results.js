import React from "react";
import './Results.css';
import {TwitterTweetEmbed} from 'react-twitter-embed';

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tweetId: ''
        }
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        if (this.props.currentTweetId !== prevProps.currentTweetId) {
            this.setState({tweetId: this.props.currentTweetId});
        }
    }

    render() {
        return (
            <div className="Results">
                <TwitterTweetEmbed key={this.state.tweetId} tweetId={this.state.tweetId}/>
            </div>
        );
    }
}

export default Results;
