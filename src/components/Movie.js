import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import swal from "sweetalert";

import useAxios from "../hooks/useAxios";

const Movie = (props) => {
  const { addToFavorites, deleteMovie } = props;

  const {
    data: movie,
    sendRequest: getMovieRequest,
    loading,
    error,
    METHODS,
  } = useAxios({ initialData: null });

  const { id } = useParams();

  const alertAndDelete = () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this movie!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // kullanıcı onay verince sil komutu çalışıyor
        deleteHandler();
        swal("Poof! Your movie has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Your precious movie is safe!");
      }
    });
  };

  const deleteHandler = (e) => {
    deleteMovie(id);
    getMovieRequest({
      url: `/movies/${id}`,
      method: METHODS.DELETE,
      redirect: "/",
      callbackSuccess: props.updateMovies,
    });
  };

  useEffect(() => {
    getMovieRequest({ url: `/movies/${id}`, method: "get" });
  }, [id]);

  return (
    <>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center">{error}</div>}
      {movie && (
        <div className="bg-white dark:bg-slate-700 rounded-md shadow flex-1">
          <div className="p-5 pb-3 border-b border-zinc-200 dark:border-zinc-900">
            <h4 className="text-xl font-bold">{movie.title} Detayları</h4>
          </div>
          <div className="px-5 py-3">
            <div className="py-1 flex">
              <div className="view-label">İsim</div>
              <div className="flex-1">{movie.title}</div>
            </div>
            <div className="py-1 flex">
              <div className="view-label">Yönetmen</div>
              <div className="flex-1">{movie.director}</div>
            </div>
            <div className="py-1 flex">
              <div className="view-label">Tür</div>
              <div className="flex-1">{movie.genre}</div>
            </div>
            <div className="py-1 flex">
              <div className="view-label">Metascore</div>
              <div className="flex-1">{movie.metascore}</div>
            </div>
            <div className="py-1 flex">
              <div className="view-label">Açıklama</div>
              <p className="flex-1">{movie.description}</p>
            </div>
          </div>

          <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-900 flex justify-end gap-2">
            <button
              onClick={() => addToFavorites(movie)}
              className="myButton bg-blue-600 hover:bg-blue-500 "
            >
              Favorilere ekle
            </button>
            <Link
              to={`/movies/edit/${movie.id}`}
              className="myButton bg-blue-600 hover:bg-blue-500"
            >
              Edit
            </Link>
            <button
              onClick={alertAndDelete}
              type="button"
              className="myButton bg-red-600 hover:bg-red-500"
            >
              Sil
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Movie;
