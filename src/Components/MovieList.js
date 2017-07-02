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
                const _this = this;

                const setStreamingItems = (streamingObj) => {
                    _this.setState({
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
                               for (var i = 0; i < details.subscription_web_sources.length; i++) {
                                   items.push(details.subscription_web_sources[i]);
                               }
                           }
                           if (details.free_web_sources.length > 0) {
                               for (var j = 0; j < details.free_web_sources.length; j++) {
                                   items.push(details.free_web_sources[j]);
                               }
                           }

                           if ( items.length >= 1 ) {
                               data.child(movie.dbId).child('streaming_sources').set(items);
                               setStreamingItems(items);
                           }

                        }).fail(function(p_oXHR, p_sStatus) {
                           console.log(p_oXHR, p_sStatus);
                        });
                    }
                }

                const cacheTime = movie.cacheTime || 0;
                const now = Math.round( new Date().getTime() / 1000 ); // Current time in seconds
                const intervalCheck = 86400; // One day

                if ( now - cacheTime > intervalCheck ) {
                    movie.dbId && data.child(movie.dbId).child('cacheTime').set(now);
                    getStreamingOptions();
                } else {
                    movie.streaming_sources && setStreamingItems(movie.streaming_sources);
                }
            }
            render() {
                const WebStreamingItems = this.state.webStreamingItems.map( (item, i) => {
                    return (
                        <a
                            key={i}
                            className={ item && 'streaming-link ' + item.source }
                            href={ item && item.link }
                            data-source-name={item.display_name}
                        >
                            <span className="util accessible-text">
                                Watch on { item && item.display_name }
                            </span>
                        </a>
                    )
                });
                return <div className="streaming-options">{WebStreamingItems}</div>;
            }
        }
        return (
                <li className={ movie.display ? 'list-group-item movie-list-item' : 'list-group-item movie-list-item hidden' } key={i}>
                    <div className="details">
                        <div className="poster">
                            <img className="small_poster" src={movie.small_poster} role="presentation" />
                            <img className="medium_poster" src={movie.medium_poster} role="presentation" />
                            <img className="large_poster" src={movie.large_poster} role="presentation" />
                            { movie.watched && <span className="watched">Watched</span> }
                        </div>

                        <a href={movie.link} className="title" target="_blank">
                            {movie.title}
                        </a>
                        <div className="year">{movie.year}</div>
                        <div className="notes">{movie.notes}</div>
                        <StreamingItem />
                        <div>Rating: {movie.myRating}</div>
                        <div className="action-wrapper">
                            <span className="action glyphicon glyphicon-edit" onClick={() => { toggleEditForm(movie) }}></span>
                            <span className="action glyphicon glyphicon-trash" onClick={() => { removeMovie(movie.dbId, movie.title) }}></span>
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
