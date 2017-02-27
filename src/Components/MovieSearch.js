import React from 'react';
import '../Styles/MovieSearch.css';

const MovieSearch = (props) => {
    const searchForMovie = function(e) {
        props.searchForMovie(e);
    }
    return (
        <div className="search-container">
            <form className="search-input-container" onSubmit={e => searchForMovie(e)}>
                <label className="util accessible-text" htmlFor="search-input">Search for movie</label>
                <input
                    className="search-input"
                    type="text"
                    id="searchInput"
                    autoComplete="off"
                />
                <button className="btn" type="submit">Search</button>
            </form>
            <h5>{props.status}</h5>
        </div>
    )
}
export default MovieSearch;
