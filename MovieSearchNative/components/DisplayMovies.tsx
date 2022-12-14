import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { IMovie } from "../interfaces/IMovie";
import Movie from "./Movie";
import { useQuery, useReactiveVar } from "@apollo/client";
import {
  GET_ALL_MOVIES,
  GET_ALL_MOVIES_FILTER_BY_GENRE,
  GET_MOVIES_BY_TITLE,
  GET_MOVIES_BY_TITLE_ASC,
  GET_MOVIES_BY_TITLE_FILTER_BY_GENRE,
  GET_MOVIES_BY_TITLE_FILTER_BY_GENRE_ASC,
} from "../queries/getMovies";
import { PAGE_OPTIONS } from "../utils/enum";
import Pagination from "./Pagination";
import {
  selectedGenre,
  selectedSorting,
  titleSearchedFor,
} from "../utils/stateManagement";
import { styles } from "../styles/DisplayMovies";
import { Octicons } from "@expo/vector-icons";

export default function DisplayMovies() {
  const [currentPage, setCurrentPage] = useState(0);
  const movieList: IMovie[] = [];
  const title = useReactiveVar(titleSearchedFor);
  const genre = useReactiveVar(selectedGenre);
  const sort = useReactiveVar(selectedSorting);

  useEffect(() => {
    setCurrentPage(0);
  }, [title, genre, sort]);

  /**
   * Function that handles which query to use based on fields (standard search, filtered search and sorted search)
   */
  function setQuery() {
    if (title && !genre) {
      if (sort === "ASC") {
        return GET_MOVIES_BY_TITLE_ASC;
      } else {
        return GET_MOVIES_BY_TITLE;
      }
    }
    if (!title && genre) {
      return GET_ALL_MOVIES_FILTER_BY_GENRE;
    }
    if (title && genre) {
      if (sort === "ASC") {
        return GET_MOVIES_BY_TITLE_FILTER_BY_GENRE_ASC;
      } else {
        return GET_MOVIES_BY_TITLE_FILTER_BY_GENRE;
      }
    } else {
      return GET_ALL_MOVIES;
    }
  }

  //Queries data using the query gotten from setQuery().
  const { loading, error, data } = useQuery(setQuery(), {
    variables: {
      where: {
        Genre_CONTAINS: genre,
      },
      filterString: genre,
      searchString: title,
      options: {
        offset: currentPage * PAGE_OPTIONS.PAGE_SIZE,
        limit: PAGE_OPTIONS.PAGE_SIZE + 1,
        sort: {
          Series_Title: "DESC",
          IMDB_Rating: sort,
        },
      },
    },
  });

  // Placeholder while loading the page.
  if (loading)
    return (
      <View style={styles.feedbackContainer}>
        <View style={styles.loadingFeedback}>
          <ActivityIndicator size="large" />
          <Text style={styles.feedbackText}>Loading movies...</Text>
        </View>
      </View>
    );

  // Displays error message if query fails.
  if (error)
    return (
      <View style={styles.feedbackContainer}>
        <View style={styles.errorFeedback}>
          <Octicons name="alert" size={40} color="white" />
          <Text style={styles.feedbackText}>Error! ${error.message}</Text>
        </View>
      </View>
    );

  // Function to determine which list is returned from database, different lists are returned for different queries
  if (data) {
    if (title && !genre) {
      if (sort === "ASC") {
        data.findMovieByTitleASC.forEach((movie: IMovie) => {
          movieList.push(movie);
        });
      } else {
        data.findMovieByTitleDESC.forEach((movie: IMovie) => {
          movieList.push(movie);
        });
      }
    } else if (title && genre) {
      if (sort === "ASC") {
        data.findMovieByTitleWithGenreFilterASC.forEach((movie: IMovie) => {
          movieList.push(movie);
        });
      } else {
        data.findMovieByTitleWithGenreFilterDESC.forEach((movie: IMovie) => {
          movieList.push(movie);
        });
      }
    } else {
      data.movies.forEach((movie: IMovie) => {
        movieList.push(movie);
      });
    }
  }
  // Function to handle no movies found
  if (movieList.length < 1) {
    return (
      <>
        <ScrollView style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>
            No movies found matching search '{titleSearchedFor()}'!
          </Text>
        </ScrollView>
        <View style={styles.pagination}>
          <Pagination
            listLength={movieList.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </View>
      </>
    );
  }

  return (
    <>
      <ScrollView>
        {movieList.map((movie: IMovie, id) => {
          if (id !== PAGE_OPTIONS.PAGE_SIZE) {
            return <Movie key={id} movie={movie} />;
          }
        })}
      </ScrollView>
      <View style={styles.pagination}>
        <Pagination
          listLength={movieList.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </View>
    </>
  );
}
