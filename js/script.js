const token =
	'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNGRhZmYzZmE3NWUyYmVkMjc5N2U5Mzc5NWUyMzNkMCIsIm5iZiI6MTc1NDU3MDQwMi44NDgsInN1YiI6IjY4OTQ5ZWEyNTgwOGQ2MTVlNDkyMjNlYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.izL8ZRorjEdMvkctVUiMmYb0eu93iytVt1nvjRBZNfY';

const container = document.querySelector('#container');
const movieNowElm = `<div id="movie__now-wrapper"></div>`
container.insertAdjacentHTML('beforeend', movieNowElm);
const movieNowWrapper = document.querySelector("#movie__now-wrapper")
const moviePopElm = `<div id="movie__pop-wrapper"></div>`
container.insertAdjacentHTML('beforeend', moviePopElm);
const moviePopWrapper = document.querySelector("#movie__pop-wrapper")


const baseImgUrl = 'https://image.tmdb.org/t/p/w500/';

//Now Showing fetch
fetch('https://api.themoviedb.org/3/movie/now_playing', {
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${token}`
	}
}).then((response) =>
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
            </article>
            `;
			})
			.join('');
		movieNowWrapper.insertAdjacentHTML('beforeend', movieCards);
	})
);

//Popular movies fetch
fetch('https://api.themoviedb.org/3/movie/popular', {
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${token}`
	}
})
	.then((res) => res.json())
	.then((movies) => {
		const popMovieCards = movies.results
			.map((movie) => {
				return /*html */ `
            <article class="movie__pop">
                <img src="${baseImgUrl + movie.poster_path}" alt="${
					movie.title
				} poster">
                <h2>${movie.title}</h2>
            </article>
            `;
			})
			.join('');

		moviePopWrapper.insertAdjacentHTML('afterbegin', popMovieCards);
	});
