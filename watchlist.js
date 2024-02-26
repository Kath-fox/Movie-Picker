import { arraysObj, searchInput, discoverHeading, watchlistHeading, fetchSearchData, getDate,
    clearSearchResults } from './modules.js'


// check the contents of local storage before rendering the watchlist
let watchListFromLocalStorage = JSON.parse(localStorage.getItem("watchList"))
if (watchListFromLocalStorage) {
    arraysObj.watchListArr = watchListFromLocalStorage
    getWatchlistHtml()
}


// Event listeners
document.addEventListener('click', function(e) {
    if (e.target.dataset.watchlistbookmark) {
        handleWatchlistBookmarkClick(e.target.dataset.watchlistbookmark)
    } else if (e.target.id === 'xmark' || e.target.id !== 'search-bar') {
        e.preventDefault()
        clearSearchResults()
    }
})


searchInput.addEventListener('input', e => {
    const value = e.target.value
    if (value.length > 1) {
        fetchSearchData(value)
    }
})


// Render the watchlist items
function getWatchlistHtml() {
    let watchlistHtml = ""
    console.log(arraysObj.watchListArr)
    for (let movie of arraysObj.watchListArr) {
        watchlistHtml += `
            <div class="movie-list-item">
                <img src="https://image.tmdb.org/t/p/w300/${movie.poster_path}" 
                    alt="${movie.title}"
                    class="list-item-poster" />
                <i class="fa-solid fa-bookmark list-bookmark bookmarked" data-watchlistbookmark="${movie.id}"></i>
                <p class="list-item-date">${getDate(movie.release_date)}</p>
                <p class="list-item-title">${movie.title}</p>
                <p class="list-item-overview">${movie.overview.slice(0, 110)}...</p>
            </div>
        `
    }
    discoverHeading.style.color = '#999999'
    watchlistHeading.style.color = 'white'
    document.getElementById('watchlist-tiles-container').innerHTML = watchlistHtml
}

// Remove an item from the watchlist if the bookmark is clicked
function handleWatchlistBookmarkClick(movieId) {
    arraysObj.watchListArr = arraysObj.watchListArr.filter((item) => item.id != movieId)
    getWatchlistHtml()
}


getWatchlistHtml()


