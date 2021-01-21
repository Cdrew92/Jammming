import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {

    constructor(props) {
        super(props);

        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    search() {
        this.props.onSearch(this.state.term);
    }

    handleTermChange(e) {
        this.setState({term: e.target.value})
        this.props.storeSearch(e.target.value);
    }

    handleKeyPress(e) {
        var key=e.keyCode || e.which;
        if (key==13){
           this.search()
        }
    }

    render() {
        return (
        <div className="SearchBar">
        <input value={this.props.applySavedSearch} onChange={this.handleTermChange} onKeyPress={this.handleKeyPress} placeholder="Enter A Song, Album, or Artist" />
        <button onClick={this.search} className="SearchButton">SEARCH</button>
        </div>
        )
    }
}

export default SearchBar;