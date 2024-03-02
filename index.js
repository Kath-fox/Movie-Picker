import { apiKey, arraysObj, options, searchInput, discoverHeading, watchlistHeading, fetchSearchData,
    clearSearchResults } from './modules.js'

let discoverArr = []
const movieTilesContainer = document.getElementById("movie-tiles-container-el")


// If there's anything in local storage then save it to the watchlist array
let watchListFromLocalStorage = JSON.parse(localStorage.getItem("watchList"))
if (watchListFromLocalStorage) {
    arraysObj.watchListArr = watchListFromLocalStorage
    fetchDiscoverData()
}


// Event Listeners
document.addEventListener('click', function(e) {
    if (e.target.dataset.discoverbookmark) {
        handleDiscoverBookmarkClick(e.target.dataset.discoverbookmark)
    } else if (e.target.id === 'xmark' || e.target.id !== 'search-bar') {
        e.preventDefault()
        clearSearchResults()
    }
    
    if (e.target.id === "discover-heading") {
        window.location.href = "/index.html"
    }

    if (e.target.id === "watchlist-heading") {
        window.location.href = "/watchlist.html"
    }
})

searchInput.addEventListener('input', (e) => {
    const value = e.target.value
    if (value.length > 1) {
        fetchSearchData(value)
    }
})


// Get Discover Page HTML
async function fetchDiscoverData() {
    const res = await fetch
    (`https://api.themoviedb.org/3/trending/movie/day?language=en-US&api_key=${apiKey}&page=1`, options)
    const data = await res.json()
    discoverArr = data.results.slice(0, 21)
    getDiscoverHtml()
}


function getDiscoverHtml() {
    let html = ""
    let bookmarkedIconClass = ""
    discoverHeading.style.color = 'white'
    watchlistHeading.style.color = '#999999'
    for (let [index, movie] of discoverArr.entries()) {
        // use some() method to see if movie.id exists in watchlistArr -if it does, change movie.bookmarked to = true
        // change colour of bookmark by adding 'bookmarked' class
        if (arraysObj.watchListArr.some(item => item.id == movie.id)) {
            movie.bookmarked = true
            bookmarkedIconClass = "bookmarked"
        } else {
            movie.bookmarked = false
            bookmarkedIconClass = ""
        }
        if (index === 0) {
            html += `
                <div class="backdrop-container" data-details="${movie.id}">
                    <img src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}" 
                        alt="${movie.title}" 
                        class="backdrop">
                    <i class="fa-solid fa-bookmark backdrop-bookmark ${bookmarkedIconClass}" data-discoverbookmark="${movie.id}" 
                        id="bookmark-el-${movie.id}">
                        </i>
                    <p class="backdrop-title">${movie.title}</p>
                </div>
        `
        } else {
            html += `
                <div class="poster-container" data-details="${movie.id}">
                    <img src="https://image.tmdb.org/t/p/w300/${movie.poster_path}" 
                        alt="${movie.title}"
                        class="poster">
                    <i class="fa-solid fa-bookmark poster-bookmark ${bookmarkedIconClass}" data-discoverbookmark="${movie.id}" 
                        id="bookmark-el-${movie.id}">
                        </i>
                </div>
            `
        }    
    }
    movieTilesContainer.innerHTML = html
}


// Add to watchlist in local storage when bookmark icon is clicked
function handleDiscoverBookmarkClick(movieId) {
// use classlist toggle for 'bookmarked' class
// loop through watch list
// if it's already in the watchlist remove it (filter it out by movie id)
// if not in watchlist add it and change bookmarked to 'true'
    let targetBookmarkObject = discoverArr.filter((discoverMovie) => discoverMovie.id == movieId)[0]
    document.getElementById(`bookmark-el-${movieId}`).classList.toggle('bookmarked')
    if (arraysObj.watchListArr.some(item => item.id == movieId)) {
        arraysObj.watchListArr = arraysObj.watchListArr.filter((item) => item.id != movieId)
    } else {
        arraysObj.watchListArr.unshift(targetBookmarkObject)
    }
    localStorage.setItem("watchList", JSON.stringify(arraysObj.watchListArr))
    fetchDiscoverData()
}


fetchDiscoverData()


// Click on a movie to go to movie details page
// Render a results page
// Refactor fetch requests to async