import React from "react";

const MovieFooter = (props) => {
  const { totalMovies } = props;

  return (
    <div className="bg-white dark:bg-slate-700 p-4 shadow rounded-md">
      <b>{totalMovies}</b> film gösteriliyor
    </div>
  );
};

export default MovieFooter;
