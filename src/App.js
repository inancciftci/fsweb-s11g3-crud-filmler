import React, { useEffect, useState } from "react";

import { Route, Switch, Redirect } from "react-router-dom";
import MovieList from "./components/MovieList";
import Movie from "./components/Movie";
import EditMovieForm from "./components/EditMovieForm";
import AddMovieForm from "./components/AddMovieForm";
import MovieHeader from "./components/MovieHeader";

import FavoriteMovieList from "./components/FavoriteMovieList";
import useLocalStorage from "./hooks/useLocalStorage";
import swal from "sweetalert";

import useAxios from "./hooks/useAxios";

const App = (props) => {
  const {
    data: movies,
    sendRequest: requestMovies,
    error,
    loading,
    METHODS,
  } = useAxios({ initialData: [] });
  const [favoriteMovies, setFavoriteMovies] = useLocalStorage("s11g3Favs", []);
  const [darkMode, setDarkMode] = useState("light");
  const documentDarkModeSetter = () => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode("light");
    }
  };
  const toggleDarkMode = () => {
    const inverseMode = darkMode === "light" ? "dark" : "light";
    localStorage.setItem("theme", inverseMode);
    // html'de dark class'ını ekleme
    documentDarkModeSetter();
  };

  useEffect(() => {
    documentDarkModeSetter();
    requestMovies({ url: "/movies", method: METHODS.GET });

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", ({ matches }) => {
        if (localStorage.getItem("theme") === null) {
          if (matches) {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
          } else {
            setDarkMode(false);
            document.documentElement.classList.remove("dark");
          }
        }
      });
  }, []);

  const deleteMovie = (id) => {
    console.log(id);
    requestMovies({
      url: "/movies/" + id,
      method: METHODS.DELETE,
    });
  };

  const updateMovies = () => {
    console.log("updateMovies");
    requestMovies({
      url: "/movies",
      method: METHODS.GET,
    });
  };

  const addToFavorites = (movie) => {
    const isMovieInFavorites = favoriteMovies.find((m) => m.id === movie.id);

    console.log("addToFavorites", movie);

    if (isMovieInFavorites) {
      swal({
        title: "Hey!",
        text: "You already have this movie in your favorites!",
        icon: "warning",
        button: "Aww yiss!",
      });
      return;
    }

    swal({
      title: "Good job!",
      text: "Your fav movie is set!",
      icon: "success",
      button: "Aww yiss!",
    });

    const newFavoriteMovies = [...favoriteMovies, movie];
    setFavoriteMovies(newFavoriteMovies);
  };

  const removeFromFavorites = (id) => {
    setFavoriteMovies(favoriteMovies.filter((m) => m.id !== id));
  };

  return (
    <div>
      <nav className="bg-zinc-800 px-6 py-3">
        <h1 className="text-xl text-white">HTTP / CRUD Film Projesi</h1>
        {
          <button
            className="bg-cyan-900 text-white p-1"
            onClick={toggleDarkMode}
          >
            {darkMode === "dark" ? "Dark Mode Açık" : "Dark Mode Kapalı"}
          </button>
        }
        {localStorage.getItem("theme") && (
          <button
            className="bg-cyan-900 text-white p-1"
            onClick={() => localStorage.removeItem("theme")}
          >
            Sistem Ayarlarına Dön
          </button>
        )}
      </nav>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center">{error}</div>}
      {!loading && !error && (
        <div className="max-w-4xl mx-auto px-3 pb-4">
          <MovieHeader />
          <div className="flex flex-col sm:flex-row gap-4">
            <FavoriteMovieList favoriteMovies={favoriteMovies} />

            <Switch>
              <Route path="/movies/edit/:id">
                <EditMovieForm
                  setMovies={requestMovies}
                  updateMovies={updateMovies}
                />
              </Route>

              <Route path="/movies/add/">
                <AddMovieForm
                  setMovies={requestMovies}
                  updateMovies={updateMovies}
                />
              </Route>

              <Route path="/movies/:id">
                <Movie
                  updateMovies={updateMovies}
                  addToFavorites={addToFavorites}
                  deleteMovie={deleteMovie}
                />
              </Route>

              <Route path="/movies">
                <MovieList movies={movies} />
              </Route>

              <Route path="/">
                <Redirect to="/movies" />
              </Route>
            </Switch>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
