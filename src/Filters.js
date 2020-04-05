import React from "react";
import './Filters.css';
import {Dropdown} from 'primereact/dropdown';
import {InputText} from 'primereact/inputtext';
import {Checkbox} from 'primereact/checkbox';
import {Button} from 'primereact/button';
import {Spinner} from 'primereact/spinner';

class Filters extends React.Component {
    topics = [
        {label: 'Statistics', value: 'Statistics'},
        {label: 'Economics', value: 'Economics'},
        {label: 'Science', value: 'Science'},
        {label: 'Education', value: 'Education'},
        {label: 'Political', value: 'Political'},
        {label: 'Environmental', value: 'Environmental'},
        {label: 'Entertainment', value: 'Entertainment'}
    ];
    accounts = [
        {label: 'Personal', value: 'Personal'},
        {label: 'Organizational', value: 'Organizational'},
        {label: 'Governmental', value: 'Governmental'}
    ];

    constructor(props) {
        super(props);
        this.state = {
            topic: null,
            days: null,
            account: null,
            language: '',
            free: '',
            recent: null,
            popular: null
        };
        // this.handleFilterClick = this.handleFilterClick.bind(this);
        this.handleClearClick = this.handleClearClick.bind(this);
    }

    handleFilterClick() {

    }

    handleClearClick() {
        this.setState({
            topic: null,
            days: '',
            account: null,
            language: '',
            free: '',
            recent: null,
            popular: null
        });
    }

    render() {
        return (
            <div className="Filters">
                <h3 className="title" id="filters-title">Filters</h3>
                <Dropdown className="filters-field" value={this.state.topic} options={this.topics}
                          style={{width: '100%'}} onChange={(e) => {
                    this.setState({topic: e.value})
                }} placeholder="Topic"/>

                <div className="filters-field">
                    <label id="filter-days-left-label" htmlFor="filter-days">From the last</label>
                    <Spinner inputId="filter-days" value={this.state.days} onChange={(e) => this.setState({days: e.value})} min={1} max={7} size={3} />
                    <label id="filter-days-right-label" htmlFor="filter-days">days</label>
                </div>
                <Dropdown className="filters-field" value={this.state.account} options={this.accounts}
                          style={{width: '100%'}}
                          onChange={(e) => {
                              this.setState({account: e.value})
                          }} placeholder="Account Type"/>
                <span className="p-float-label filters-field">
                    <InputText id="filter-language" value={this.state.language} style={{width: '100%'}}
                               onChange={(e) => this.setState({language: e.target.value})}/>
                    <label htmlFor="filter-language">Language</label>
                </span>
                <span className="p-float-label filters-field">
                    <InputText id="filter-free" value={this.state.free} style={{width: '100%'}}
                               onChange={(e) => this.setState({free: e.target.value})}/>
                    <label htmlFor="filter-free">Free Text</label>
                </span>
                <div className="filters-field">
                    <Checkbox inputId="filter-recent" onChange={e => this.setState({recent: e.checked})}
                              checked={this.state.recent}/>
                    <label htmlFor="filter-recent" className="p-checkbox-label">Most Recent</label>
                </div>
                <div className="filters-field">
                    <Checkbox inputId="filter-popular" onChange={e => this.setState({popular: e.checked})}
                              checked={this.state.popular}/>
                    <label htmlFor="filter-popular" className="p-checkbox-label">Most Popular</label>
                </div>
                <div className="filters-footer">
                    <Button label="Filter" onClick={this.handleFilterClick}/>
                    <Button label="Clear" onClick={this.handleClearClick}/>
                </div>
            </div>
        );
    }
}

export default Filters;
