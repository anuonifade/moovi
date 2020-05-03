import React, { useState, useEffect, useReducer } from 'react';
import './App.css';
import Header from './Header';
import Movie from './Movie';
import Search from './Search';

const MOVIE_API_URL = "https://www.omdbapi.com";
const API_KEY = "bddc6e8d";

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCCESS": 
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch(`${MOVIE_API_URL}/?s=man&apikey=${API_KEY}`)
      .then(response => response.json())
      .then(jsonResponse => {
        dispatch({
          type: "SEARCH_MOVIES_SUCCESS",
          payload: jsonResponse.Search
        });
      });
  },[]);

  const search = (searchValue) => {
    dispatch({
      type: "SEARCH_MOVIES_REQUEST"
    })

    fetch(`${MOVIE_API_URL}/?s=${searchValue}&apikey=${API_KEY}`)
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.Response === "True") {
          dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonResponse.Search
          })
        } else {
          dispatch({
            type: "SEARCH_MOVIES_FAILURE",
            payload: jsonResponse.Error
          })
        }  
      });
  }

  const { movies, loading, errorMessage } = state;

  return (
    <div className="App">
      <Header text = "Moovi" />
      <Search search={search} />
      <p className="App-intro"> Sharing a few of our favourite movies </p>
      <div className="movies">
        { loading && !errorMessage ? (
          <span className="animated infinite flash delay-1s">loading...</span>
        ) : errorMessage ? (
          <div className="errorMessage">{ errorMessage }</div>
        ) : (
            movies.map((movie, index) => (<Movie key={`${index}-${movie.Title}`} movie={movie} />))
        )}
      </div>
    </div>
  );
}

export default App;
