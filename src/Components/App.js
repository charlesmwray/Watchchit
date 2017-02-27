/*eslint no-undef: 0*/
import React, { Component } from 'react';

import MovieList from './MovieList.js';
import MovieSearch from './MovieSearch.js';
import MovieSearchResult from './MovieSearchResult';
import MovieEdit from './MovieEdit';

import data from '../Data/firebase';

import '../Styles/App.css';
import '../Styles/Header.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [{title:'Loading'}],
            queryState: '',
            showSerchResult: false,
            searchResults: [],
            editForm: {
                show: false,
                id: null,
                movie: {}
            }
        }
    }

    componentDidMount() {

        const setMovies = (arr) => {
            this.setState({
                movies: arr,
            });
        }

        data.on('value', function(snapshot) {
            var keys = Object.keys(snapshot.val());
            var formattedMovies = [];

            for (var i = 0; i < keys.length; i++) {
                formattedMovies.push({
                    link:      'http://www.imdb.com/title/' + snapshot.val()[keys[i]].imdb,
                    myRating:  snapshot.val()[keys[i]].myRating || 0,
                    title:     snapshot.val()[keys[i]].title,
                    id:        snapshot.val()[keys[i]].id,
                    poster:    snapshot.val()[keys[i]].poster_120x171,
                    watched:   snapshot.val()[keys[i]].watched || false,
                    notes:     snapshot.val()[keys[i]].notes || '',
                    year:      snapshot.val()[keys[i]].release_year,
                    cacheTime: snapshot.val()[keys[i]].cacheTime,
                    subscription_web_sources: snapshot.val()[keys[i]].subscription_web_sources,
                    free_web_sources: snapshot.val()[keys[i]].free_web_sources,
                    dbId:      keys[i]
                });
            }

            setMovies(formattedMovies.reverse());

        }, function (errorObject) {
            // TODO: add error state to UI
            console.log("The read failed: " + errorObject.code);

        });

    }
    searchForMovie(e) {
        e.preventDefault();

        var api = '&api_key=bbd37ad3b028476884a4610e508dd04ef6a00ac5'
        var base = 'http://api-public.guidebox.com/v2/';
        var search = base + 'search?type=movie&field=title&query=' + e.target.searchInput.value;
        var query = search + api;

        const setQueryState = (str) => {
            this.setState({
                queryState: str
            });
        }

        const setSearchResults = (result) => {
            this.setState({
                searchResults: result,
            });
            setShowSearchResults(true);
            document.getElementById('add-movie-button').focus();
        }

        const setShowSearchResults = (state) => {
            this.setState({
                showSerchResult: state
            })
        }

        setQueryState('Searching');

        $.ajax({
            url: query,
            type: "GET",
        }).done(function(p_oXHR, p_sStatus) {
            var results = p_oXHR.results;
            if (p_sStatus === "success" && results.length > 0) {
                setQueryState('Search complete');
                setSearchResults(results.slice(0,10));
            } else {
                setQueryState('No results returned');
                setShowSearchResults(false);
            }
        }).fail(function(p_oXHR, p_sStatus) {
            const errorMessage = (
                <div>
                    Error. Please try again.<br/>
                    Movie search may be down.<br />
                See <a href="http://omdbapi.com" target="_blank">OMDb API</a> for more info.
                </div>
            )
            setQueryState(errorMessage);
        });

    }
    resetSearch() {
        this.setState({
            queryState: '',
            showSerchResult: false,
            searchResult: {},
        });
        document.getElementById('searchInput').value = '';
    }
    addMovie(id) {
        const setQueryState = (str) => {
            this.setState({
                queryState: str
            });
        }
        const resetSearch = () => {
            this.resetSearch();
        }
        const saveData = this.state.searchResults[id];

        const base = 'http://api-public.guidebox.com/v2/movies/';
        const api = '?api_key=bbd37ad3b028476884a4610e508dd04ef6a00ac5'
        const query = base + this.state.searchResults[id].id + api;

        $.ajax({
            url: query,
            type: "GET",
        }).done(function(details, p_sStatus) {
            if (details.subscription_web_sources.length > 0) {
                saveData.subscription_web_sources = details.subscription_web_sources;
            }
            if (details.free_web_sources.length > 0) {
                saveData.free_web_sources = details.free_web_sources;
            }

            data.push(saveData, function(error) {
                if (!error) {
                    setQueryState('Saved');
                    resetSearch();
                } else {
                    setQueryState('Save error.');
                }
            });

        }).fail(function(p_oXHR, p_sStatus) {
            console.log(p_oXHR, p_sStatus);
        });
    }
    toggleEditForm(movie) {
        this.setState({
            editForm: {
                show: !this.state.editForm.show,
                movie: movie
            }
        })
    }
    render() {
        return (
            <div>
                { this.state.editForm.show && <MovieEdit details={this.state.editForm} toggleEditForm={this.toggleEditForm.bind(this)} /> }
                <div className="row">
                    <div className="col-sm-3 hidden-xs">
                        <h1 className="header-text">
                            Movie <br/>
                            List
                        </h1>
                    </div>
                    <div className="col-xs-12 col-sm-9">
                        <header className="header">
                            <h1 className="header-text visible-xs-*">Movie List</h1>
                            <MovieSearch
                                status={this.state.queryState}
                                searchForMovie={this.searchForMovie.bind(this)}
                                />
                        </header>
                        {
                            this.state.showSerchResult &&
                            <MovieSearchResult
                                searchResults={this.state.searchResults}
                                addMovie={this.addMovie.bind(this)}
                                resetSearch={this.resetSearch.bind(this)}
                                />
                        }
                        <MovieList
                            movies={this.state.movies}
                            toggleEditForm={this.toggleEditForm.bind(this)}
                        />
                    </div>
                </div>
            </div>
        )
    }

}

export default App;
