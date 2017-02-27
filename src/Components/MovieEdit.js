import React, {Component} from 'react';

import data from '../Data/firebase';

import '../Styles/MovieEdit.css';

class MovieEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rating: this.props.details.movie.myRating,
            watched: this.props.details.movie.watched,
            notes: this.props.details.movie.notes,
            toggleEditForm: this.props.toggleEditForm
        }

    }
    toggleEditForm(e) {
        e.preventDefault();
        this.state.toggleEditForm();
    }
    saveChanges(e, movie) {
        e.preventDefault();
        data.child(movie.dbId).child('myRating').set(e.target.rating.value);
        data.child(movie.dbId).child('notes').set(e.target.notes.value);
        data.child(movie.dbId).child('watched').set(e.target.watched.checked);

        this.state.toggleEditForm();
    }
    render() {
        return (
            <div className="edit-form-bg">
                <form onSubmit={e => this.saveChanges(e, this.props.details.movie)}>
                    <div className="edit-form">
                        <div className="title">
                            {this.props.details.movie.title}
                        </div>
                        <div className="form-field">
                            <span className="form-label">
                                Rating: {this.state.rating}
                            </span>
                            <input id="rating" className="range-input" type="text" min="0" max="100" defaultValue={this.state.rating} />
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="notes">Notes:</label>
                            <textarea className="textarea" id="notes" defaultValue={this.state.notes} />
                        </div>
                        <div className="form-field">
                            <label htmlFor="watched">Watched</label>
                            <input type="checkbox" id="watched" className="rating-checkbox" defaultChecked={this.state.watched} />
                            <button className="pull-right" type="submit">Save</button>
                            <button className="pull-right" onClick={(e) => { this.toggleEditForm(e) }}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default MovieEdit;
