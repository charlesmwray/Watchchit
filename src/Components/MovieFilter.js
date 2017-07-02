/*eslint no-undef: 0*/
import React from 'react';
import '../Styles/MovieFilter.css';

const MovieFilter = (props) => {
    const filterWatched = function(e, data) {
        props.filterWatched(e.target.checked);
    }
    const filterMovies = function(e, term) {
        let sources = [];
        $.each( $('#sources input[name="source"]:checked'), (i, item) => {
            if ( $(item)[0].checked ) {
                sources.push( $(item).val() );
            }
        })
        props.filterMovies(sources);
    }
    return (
        <div className="filter-container">
            <div className="filter-item">
                <input id="watched-filter" type="checkbox" onChange={e => filterWatched(e)} />
                <label htmlFor="watched-filter">Watched</label>
            </div>
            <form id="sources" onChange={e => filterMovies(e, 'Netflix')}>
                <div className="filter-item">
                    <input id="netflix-filter" name="source" type="checkbox" value="netflix"/>
                    <label htmlFor="netflix-filter">Netflix</label>
                </div>
                <div className="filter-item">
                    <input id="amazon-filter" name="source" type="checkbox" value="amazon" />
                    <label htmlFor="amazon-filter">Amazon</label>
                </div>
            </form>
        </div>
    )
}
export default MovieFilter;
