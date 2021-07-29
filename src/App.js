import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// @3:00 https://www.udemy.com/course/react-the-complete-guide-incl-redux/learn/lecture/25599820#content
	//    useCallback() allows us to save the fetchMoviesHandler function in some allocated space
	//    which enables it to have the same pointer/reference, as objects e.g functions would not be compared and interpreted as identical
	//    this allows us to add it as a dependency in the useEffect() hook.
	//    In our case here, it's not really needed, an empy dependency array for useEffect would suffice,
	//    however it would be needed if our fetchMoviesHandler would be using external state.
	const fetchMoviesHandler = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch("https://swapi.dev/api/film/");
			if (!response.ok) throw new Error("Something went Wrong!");

			const data = await response.json();
			const transformedMovies = data.results.map((movieData) => {
				return {
					id: movieData.episode_id,
					title: movieData.title,
					openingText: movieData.opening_crawl,
					releaseDate: movieData.release_date,
				};
			});
			setMovies(transformedMovies);
		} catch (error) {
			setError(error.message);
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchMoviesHandler();
	}, [fetchMoviesHandler]);

	let content = <MoviesList movies={movies} />;
	if (movies.length === 0) content = <p>Found no movies.</p>;
	if (isLoading) content = <p>Loading...</p>;
	if (error) content = <p>{error}</p>;

	return (
		<React.Fragment>
			<section>
				<button onClick={fetchMoviesHandler}>Fetch Movies</button>
			</section>
			<section>{content}</section>
		</React.Fragment>
	);
}

export default App;
