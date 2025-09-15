const apiCredits = {
	headers: {
		accept: 'application/json',
		Authorization:
			'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNGRhZmYzZmE3NWUyYmVkMjc5N2U5Mzc5NWUyMzNkMCIsIm5iZiI6MTc1NDU3MDQwMi44NDgsInN1YiI6IjY4OTQ5ZWEyNTgwOGQ2MTVlNDkyMjNlYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.izL8ZRorjEdMvkctVUiMmYb0eu93iytVt1nvjRBZNfY'
	}
};

//Container div
const container = document.querySelector('#container');
const myMoviesHeader = `<header class="header"><h1 class="header__title">MyMovies</h1> <label class="switch">
  <input type="checkbox">
  <span class="slider round"></span>
</label></header>`;
container.insertAdjacentHTML('beforeend', myMoviesHeader)
//Now Playing wrapper div
const movieNowElm = `<section id="movie__now-wrapper"><header class="movie__now-header"><h2 class="movie__now-title">Now Showing</h2> <a href="#" class="seeMoreBtn">See more</a></header></section>`;
container.insertAdjacentHTML('beforeend', movieNowElm);
const movieNowWrapper = document.querySelector('#movie__now-wrapper');
//Popular Movie wrapper div
const moviePopElm = `<section id="movie__pop-wrapper"><header class="movie__pop-header"><h2 class="movie__pop-title">Popular</h2> <a href="#" class="seeMoreBtn">See more</a></header></section>`;
container.insertAdjacentHTML('beforeend', moviePopElm);
const moviePopWrapper = document.querySelector('#movie__pop-wrapper');
//Image API
const baseImgUrl = 'https://image.tmdb.org/t/p/w500/';

//Now Showing fetch
fetch('https://api.themoviedb.org/3/movie/now_playing', apiCredits).then(
	(response) =>
		response.json().then((movies) => {
			console.log(movies);
			const movieCards = movies.results
				.map((movie) => {
					return /*html */ `
            <article class="movie__now">
                <img src="${baseImgUrl + movie.poster_path}" alt="${
						movie.title
					} poster">
                <h2>${movie.title}</h2>
                <div class="rating">
                <img src="./icons/ratingStar.svg" alt="Rating star icon">
                <p>${movie.vote_average.toFixed(1)}/10</p>
                </div>
            </article>
            `;
				})
				.join('');
			movieNowWrapper.insertAdjacentHTML('beforeend', movieCards);
		})
);

//Popular movies and details fetch
async function fetchPopularMoviesAndDetails() {
	try {
		const response = await fetch(
			'https://api.themoviedb.org/3/movie/popular',
			apiCredits
		);
		const movies = await response.json();

		const moviesWithDetails = await Promise.all(
			movies.results.map(async (movie) => {
				try {
					const detailResponse = await fetch(
						`https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`,
						apiCredits
					);

					const movieDetails = await detailResponse.json();

					return {
						...movie,
						runtime: movieDetails.runtime,
						genres: movieDetails.genres || []
					};
				} catch (error) {
					console.error(`Error fetching details for movie ${movie.id}:`, error);

					return { ...movie, genres: [] };
				}
			})
		);

		const popMovieCards = moviesWithDetails
			.map((movie) => {
				const genreTags = movie.genres
					.slice(0, 3)
					.map((genre) => `<span class="genre-tag">${genre.name}</span>`)
					.join('');

				return /*html */ `
            <article class="movie__pop">
                <img src="${baseImgUrl + movie.poster_path}" alt="${
					movie.title
				} poster">
                <div class="card__pop">
                    <h2>${movie.title}</h2>
                    <div class="rating">
                        <img src="./icons/ratingStar.svg" alt="Rating star icon" class="rating__icon">
                        <p class="rating__text">${movie.vote_average.toFixed(
													1
												)}/10</p>
                    </div>
                    <div class="genre">
                        ${genreTags}
                    </div>

                    <div class="runtime">
                    <img src="./icons/clock.svg" alt="clock icon" class="runtime__icon">    
                    <p class="runtime__text">${movie.runtime} min.</p>
                    </div>
                </div>

            </article>
            `;
			})
			.join('');
		moviePopWrapper.insertAdjacentHTML('beforeend', popMovieCards);
	} catch (error) {
		console.error('Error fetching popular movies:', error);
	}
}

fetchPopularMoviesAndDetails();
