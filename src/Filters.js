import React from "react";
import './Filters.css';
import {Dropdown} from 'primereact/dropdown';
import {InputText} from 'primereact/inputtext';
import {Checkbox} from 'primereact/checkbox';
import {Button} from 'primereact/button';

class Filters extends React.Component {
    topics = [
        {label: 'Audi', value: 'Audi'},
        {label: 'BMW', value: 'BMW'},
        {label: 'Fiat', value: 'Fiat'},
        {label: 'Honda', value: 'Honda'},
        {label: 'Jaguar', value: 'Jaguar'},
        {label: 'Mercedes', value: 'Mercedes'},
        {label: 'Renault', value: 'Renault'},
        {label: 'VW', value: 'VW'},
        {label: 'Volvo', value: 'Volvo'}
    ];
    days = [
        {label: 'Audi', value: 'Audi'},
        {label: 'BMW', value: 'BMW'},
        {label: 'Fiat', value: 'Fiat'},
        {label: 'Honda', value: 'Honda'},
        {label: 'Jaguar', value: 'Jaguar'},
        {label: 'Mercedes', value: 'Mercedes'},
        {label: 'Renault', value: 'Renault'},
        {label: 'VW', value: 'VW'},
        {label: 'Volvo', value: 'Volvo'}
    ];
    accounts = [
        {label: 'Audi', value: 'Audi'},
        {label: 'BMW', value: 'BMW'},
        {label: 'Fiat', value: 'Fiat'},
        {label: 'Honda', value: 'Honda'},
        {label: 'Jaguar', value: 'Jaguar'},
        {label: 'Mercedes', value: 'Mercedes'},
        {label: 'Renault', value: 'Renault'},
        {label: 'VW', value: 'VW'},
        {label: 'Volvo', value: 'Volvo'}
    ];

    constructor(props) {
        super(props);
        this.state = {
            topic: null,
            day: null,
            account: null,
            language: '',
            free: '',
            recent: null,
            popular: null
        }
    }

    handleFilterClick() {

    }

    handleClearClick() {

    }

    render() {
        return (
            <div className="Filters">
                <h3 className="title" id="filters-title">Filters</h3>
                <Dropdown className="filters-field" value={this.state.topic} options={this.topics} onChange={(e) => {
                    this.setState({topic: e.value})
                }} placeholder="Select a Topic"/>
                <Dropdown className="filters-field" value={this.state.day} options={this.days} onChange={(e) => {
                    this.setState({days: e.value})
                }} placeholder="Select a Day"/>
                <Dropdown className="filters-field" value={this.state.account} options={this.accounts}
                          onChange={(e) => {
                              this.setState({account: e.value})
                          }} placeholder="Select an Account"/>
                <span className="p-float-label filters-field">
                    <InputText id="filter-language" value={this.state.language}
                               onChange={(e) => this.setState({language: e.target.value})}/>
                    <label htmlFor="filter-language">Language</label>
                </span>
                <span className="p-float-label filters-field">
                    <InputText id="filter-free" value={this.state.free}
                               onChange={(e) => this.setState({free: e.target.value})}/>
                    <label htmlFor="filter-free">Free</label>
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
