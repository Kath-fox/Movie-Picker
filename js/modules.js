export { apiKey, arraysObj, options, searchInput, searchResultsEl, xmark, 
            magnifyingGlass, discoverHeading, watchlistHeading, fetchSearchData, getDate,
            clearSearchResults }

const apiKey = "845b1187fa055cf28cb31c0e8a2ec01a"
const searchInput = document.getElementById("search-input")
const searchResultsEl = document.getElementById('search-results-el')
const xmark = document.getElementById('xmark')
const magnifyingGlass = document.getElementById('magnifying-glass')
const discoverHeading = document.getElementById('discover-heading')
const watchlistHeading = document.getElementById('watchlist-heading')

let arraysObj = {
    watchListArr: [],
    searchResults: [],
}

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  }


// Render search results in the movie searchbar
async function fetchSearchData(inputValue) {
    const res = await fetch
    (`https://api.themoviedb.org/3/search/movie?query=${inputValue}&include_adult=false&language=en-US&api_key=${apiKey}&page=1`, 
    options)
    const data = await res.json()
    renderSearchResults(data)
}
    
    
function renderSearchResults(movies){
    arraysObj.searchResults = movies.results.slice(0, 5)
    console.log(arraysObj.searchResults)
    let searchResultshtml = ""
    searchResultsEl.style.display = "block"
    xmark.style.display = "block"
    magnifyingGlass.style.display = "none"
    for (let movie of arraysObj.searchResults) {
        searchResultshtml += `
            <div class="movie-list-item" data-details="${movie.id}">
                <img src="https://image.tmdb.org/t/p/w300/${movie.poster_path}" 
                    alt="${movie.title}"
                    class="list-item-poster"
                    data-movie="${movie.id}">
                <p class="list-item-date" data-movie="${movie.id}">${getDate(movie.release_date)}</p>
                <p class="list-item-title" data-movie="${movie.id}">${movie.title}</p>
                <p class="list-item-overview" data-movie="${movie.id}">${movie.overview.slice(0, 110)}...</p>
            </div>
        `
    }
    if (document.getElementById('movie-tiles-container-el') != null) {
        document.getElementById('movie-tiles-container-el').style.display = 'none'
    } else {
        document.getElementById('watchlist-tiles-container').style.display = 'none'
    }
    
    searchResultsEl.innerHTML = searchResultshtml
}


// Format movie release date
function getDate(date) {
    const dd = date.slice(8)
    const mm = date.slice(5, 7)
    const yyyy = date.slice(0, 4)
    const newDate = `${dd}/${mm}/${yyyy}`
    return newDate
}


// Clear the search bar input when cross is clicked, or clicking away from search dropdown
function clearSearchResults() {
    searchResultsEl.style.display = "none"
    xmark.style.display = "none"
    magnifyingGlass.style.display = "block"
    searchInput.value = ""
    if (document.getElementById('movie-tiles-container-el') != null) {
        document.getElementById('movie-tiles-container-el').style.display = 'flex'
    } else {
        document.getElementById('watchlist-tiles-container').style.display = 'block'
    }
}