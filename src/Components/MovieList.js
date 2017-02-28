/*eslint no-undef: 0*/
import React, {Component} from 'react';

import data from '../Data/firebase';

import '../Styles/MovieList.css';

const removeMovie = (id, title) => {
    if (confirm("Remove " + title + "?") === true) {
         data.child(id).remove();
    }
}
const MovieList = (props) => {
    const toggleEditForm = function(movie) {
        props.toggleEditForm(movie);
    }
    const movieItems = props.movies.map( (movie, i) => {
        class StreamingItem extends Component {
            constructor(props) {
                super(props);

                this.state = {
                    webStreamingItems: []
                }
            }
            componentDidMount() {
                const base = 'https://api-public.guidebox.com/v2/movies/';
                const api = '?api_key=bbd37ad3b028476884a4610e508dd04ef6a00ac5'
                const query = base + movie.id + api;

                const setStreamingItems = (streamingObj) => {
                    this.setState({
                        webStreamingItems: streamingObj
                    })
                }

                const getStreamingOptions = () => {
                    if ( movie.id ) {
                        $.ajax({
                           url: query,
                           type: "GET",
                        }).done(function(details, p_sStatus) {
                           var items = [];
                           if (details.subscription_web_sources.length > 0) {
                               items.push(details.subscription_web_sources);

                               movie.dbId && data.child(movie.dbId).child('subscription_web_sources').set(details.subscription_web_sources);
                           }
                           if (details.free_web_sources.length > 0) {
                               items.push(details.free_web_sources);
                               data.child(movie.dbId).child('free_web_sources').set(details.free_web_sources);
                           }
                           setStreamingItems(items)

                        }).fail(function(p_oXHR, p_sStatus) {
                           console.log(p_oXHR, p_sStatus);
                        });
                    }
                }
                const cacheTime = movie.cacheTime || 0;
                if ( Math.round( new Date().getTime() / 1000) - cacheTime > 8.64e+7 ) {
                    getStreamingOptions();
                } else {
                    var items = [];
                    movie.subscription_web_sources && items.push(movie.subscription_web_sources);

                    setStreamingItems(items)
                }
            }
            render() {
                const WebStreamingItems = this.state.webStreamingItems.map( (item, i) => {
                    return (
                        <a
                            key={i}
                            className={ item[i] && 'streaming-link ' + item[i].source }
                            href={ item[i] && item[i].link }>
                            <span className="util accessible-text">
                                Watch on { item[i] && item[i].display_name }
                            </span>
                        </a>
                    )
                });
                return <div>{WebStreamingItems}</div>;
            }
        }
        return (
            <li className="list-group-item movie-list-item" key={i}>
                <div className="poster">
                    <img src={movie.poster} role="presentation" />
                    <div className="year">{movie.year}</div>
                </div>
                <div className="metadata-wrapper">
                    <a href={movie.link} className="title" target="_blank">
                        {movie.title}
                    </a>
                    <div className="notes">{movie.notes}</div>
                    <div className="streaming-options">
                        <StreamingItem />
                    </div>
                </div>
                <div className="action-wrapper">
                    Rating: {movie.myRating} { movie.watched && <span className="watched">Watched</span> }
                    <div className="button-group">
                        <button className="btn" onClick={() => { toggleEditForm(movie) }}>Edit</button>
                        <button className="remove button btn" onClick={() => { removeMovie(movie.dbId, movie.title) }}>X</button>
                    </div>
                </div>
            </li>
        )
    });
    return (
        <ul className="list-group movie-list">
            {movieItems}
        </ul>
    )
}

export default MovieList;
