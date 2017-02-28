import React from 'react';
import '../Styles/MovieSearch.css';

const MovieSearchResult = (props) => {
    const addMovie = (id) => {
        props.addMovie(id);
    }
    const results = props.searchResults.map( function(result, i) {
        return (
            <li className="search-result list-group-item" key={i}>
                <span className="poster">
                    <img src={result.poster_120x171} role="presentation" />
                </span>
                <span className="title">
                    {result.title}
                </span>
                <span className="year">
                    {result.release_year}
                </span>
                <button
                    onClick={ () => { addMovie(i) } }
                    id="add-movie-button"
                    aria-labelledby="add-search-result-label"
                    className="btn add-movie-button"
                >+</button>
                <span className="util accessible-text" id="add-search-result-label">Add {result.title}, {result.release_year}</span>
            </li>
        )
    })
    return (
        <div className="search-results">
            <div className="header-wrapper">
                <h2 className="header">Search results</h2>
                <button
                    onClick={props.resetSearch}
                    className="btn"
                >Cancel</button>
            </div>
            <ul className="list-group">
                {results}
            </ul>
        </div>
    )
}
export default MovieSearchResult;
