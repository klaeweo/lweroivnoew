getStorage()

// * USER CLICKS BACKWARD / FORWARD

const sections = {
    home: document.getElementById('home'),
    results: document.getElementById('result-container'),
    moviepage: document.getElementById('movie-page')
}

// Initial state
Object.values(sections).forEach(section => {
    section.classList.add('hide')
})
sections.home.classList.remove('hide')

// move to the section

function movetoSection(sectionKey) {
    Object.keys(sections).forEach(key => {

        if(key === sectionKey){
            sections[key].classList.remove('hide')
        } else {
            sections[key].classList.add('hide')
        }

        if(sectionKey !== 'results'){
            searchInput.value = ''
            searchInput.blur()
        }
    })
    history.pushState({currentSection: sectionKey}, null, location.href);
}

// Event listener for back/forward button click
window.addEventListener('popstate', (event) => {
    const {currentSection} = event.state || {currentSection: 'home'};
    movetoSection(currentSection)    
})

// * EXTRACT INPUT BOX VALUE

const searchInput = document.getElementById('search')
const searchIc = document.getElementById('search-ic')
const resultContainer = document.getElementById('result-container')
const watchlist = document.getElementById('watchlist');

searchInput.addEventListener('keyup', (e)=> {
    if(e.key === 'Enter'){       
        searchMovie()
    }
})

searchIc.addEventListener('click', ()=> {
    searchMovie()
})

// * SEARCH MOVIE IN TMDB

function searchMovie(){

    const inputValue = searchInput.value.replace(/^\s+/, '').replace(/^\s*$/, '');

        if(inputValue){

            sections.results.classList.remove('hide')
            sections.home.classList.add('hide')
            sections.moviepage.classList.add('hide');

            resultContainer.innerHTML = ''

            const searchValue = inputValue.replace(/ /g,'+')

            tmdbApi()

            async function tmdbApi() {

                const url = `https://api.themoviedb.org/3/search/movie?query=${searchValue}`
    
                const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYjFmNmY5ZjNmOGYzMzRiZDI4YjRkYjRlMDQ1YTUyOCIsIm5iZiI6MTczNTM3Njc1NS4yMDMsInN1YiI6IjY3NmZiZjczODI1ODI5NGJiODYxODRkZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.S5e3anz9U3QeS4iCCRDigu2eRJsetJnow4YYJdAaXFE';
                
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${ACCESS_TOKEN}`
                        }
                    })
                
                    const data = await response.json();
                
                    // console.log(data.results);
                
                    const results = data.results
                    
                    results.forEach(result => {
                        
                        const movieCardHtml = movieCard(result.id, `https://image.tmdb.org/t/p/original/${result.poster_path}`, result.title, result.overview)
                        
                        resultContainer.innerHTML += movieCardHtml
                
                    });
                    
                } catch (error) {
                    console.error("Error:", error);    
                }
                }

        }
}

// * MOVIE CARD MAKER

function movieCard(tmdbId, poster, name, overview) {

    const card = `<div class="movie-card" id="${tmdbId}">
                        <div class="image-wrap" onclick="MoviePg(${tmdbId}, '${name}', '${overview}')">
                            <img src="${poster}" alt="poster">
                        </div>
                        <div class="card-content">
                            <h4 onclick="MoviePg(${tmdbId}, '${name}', '${overview}')">
                                ${name}
                            </h4>
                            <i class="fa-regular fa-trash-can" onclick="del(${tmdbId})"></i>
                        </div>
                    </div>`

    return card;
}

// * UPDATE HERO SECTION

function updateHero(tmdbId, poster, name, overview) {
    
    const hero = document.querySelector('.hero')
    
    hero.innerHTML = ''

    const resume = `<img src="${poster}" alt="poster">
            <section>
                <div>
                    <h1>
                        ${name}
                    </h1>
                    <p>${overview}</p>
                </div>
                <button type="button" onclick="window.location.href='https://vidsrc.net/embed/movie?tmdb=${tmdbId}';">
                    <i class="fa-solid fa-play"></i>
                    Resume
                </button>
            </section>`

            hero.innerHTML = resume;
}

// * MOVIE DETAILS PAGE

function MoviePg(tmdbId, name, overview) {
    
    const moviePg = document.getElementById('movie-page')
    
    const pghtml = `<div class="movie-pg">
            <iframe src="https://vidsrc.net/embed/movie?tmdb=${tmdbId}" frameborder="0" referrerpolicy="origin"></iframe>
        
            <div class="overlay">
                <button onclick="playMovie(${tmdbId})">
                    <i class="fa-solid fa-circle-play"></i>
                </button>
                <div class="details">
                    <h2>${name}</h2>
                    <p>
                        ${overview}
                    </p>
                </div>
            </div>
        </div>`

            moviePg.innerHTML = pghtml;
            
            movetoSection('moviepage')

}

// * PLAY MOVIE

function playMovie(tmdbId){

    let idArray = JSON.parse(localStorage.getItem('ids')) || [];
    
    // delete duplicates(tmdbId)

    const movieCard = document.getElementById(tmdbId);

    const itemIndex = idArray.indexOf(tmdbId);

    if(itemIndex !== -1){
        idArray.splice(itemIndex, 1);
        movieCard.remove();
    }
    
    // add item to the storage

    idArray.push(tmdbId);

    localStorage.setItem('ids', JSON.stringify(idArray))

    window.location.href = `https://vidsrc.net/embed/movie?tmdb=${tmdbId}`;
}

// * DELETE MOVIE-CARD

function del(tmdbId){

    const movieCard = document.getElementById(tmdbId);

    // removeFromStorage(tmdbId)
    let idArray = JSON.parse(localStorage.getItem('ids'));

    const itemIndex = idArray.indexOf(tmdbId);

    if(itemIndex !== -1){
        idArray.splice(itemIndex, 1);
    }

    localStorage.setItem('ids', JSON.stringify(idArray))
    
    movieCard.remove();
}

// * GET LOCAL STORAGE
function getStorage(){

    let idArray = JSON.parse(localStorage.getItem('ids')) || [];

    if(idArray.length > 0){
        idArray.forEach(tmdbId => {

            const api_key = 'cb1f6f9f3f8f334bd28b4db4e045a528';
    
            const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${api_key}`;
    
            restoreWatchlist(tmdbId)
            
            async function restoreWatchlist(tmdbId) {
                
                const response = await fetch(url);
    
                const data = await response.json();
    
                const movieCardHtml = movieCard(data.id, `https://image.tmdb.org/t/p/original/${data.poster_path}`, data.title, data.overview);
    
                watchlist.innerHTML += movieCardHtml;

                reverseWatchlist()

                updateHero(data.id, `https://image.tmdb.org/t/p/original/${data.poster_path}`, data.title, data.overview);
    
            }
        });
    }

    
}

// * REVERSE THE ORDER OF WATCHLIST

function reverseWatchlist() {
    const children = document.querySelectorAll('.movie-card');

    children.forEach((child, index) => {
        child.style.order = -index;
    })
}

// * INFO - CREDITS

function openInfo() {
    document.querySelector('.info').style.display = 'flex'
    document.querySelector('.overlay').style.display = 'block'
}

function closeInfo() {
    document.querySelector('.info').style.display = 'none'
    document.querySelector('.overlay').style.display = 'none'
}
