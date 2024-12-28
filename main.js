//* SCROLL

const scrollContainer = document.getElementById('slider')
const backBtn = document.getElementById('scrl_bd')
const forwardBtn = document.getElementById('scrl_fd')

backBtn.style.visibility = "hidden"

if(scrollContainer.clientWidth === scrollContainer.scrollWidth){
    forwardBtn.style.visibility = "hidden"
}

scrollContainer.addEventListener('wheel', (e)=> {
    e.preventDefault()

    scrollContainer.scrollLeft += e.deltaY;
    scrollContainer.style.scrollBehavior = 'auto';
})

backBtn.addEventListener('click', ()=> {
    scrollContainer.style.scrollBehavior = "smooth"
    scrollContainer.scrollLeft -= scrollContainer.offsetWidth;
})

forwardBtn.addEventListener('click', ()=> {
    scrollContainer.style.scrollBehavior = "smooth"
    scrollContainer.scrollLeft += scrollContainer.offsetWidth;
})

scrollContainer.addEventListener('scroll', ()=> {
    if(scrollContainer.scrollLeft === 0){
        backBtn.style.visibility = "hidden"
    }else{
        backBtn.style.visibility = "visible"
    }

    if(scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth){
        forwardBtn.style.visibility = "hidden"
    }else {
        forwardBtn.style.visibility = "visible"
    }
})

// scroll to top

// * IMDB

const url = 'https://imdb236.p.rapidapi.com/imdb/search?type=movie&genre=Drama&sortField=id&sortOrder=ASC';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '96f7aadffamshcf9881edba5d98dp1148aajsn732ba52bbde4',
		'x-rapidapi-host': 'imdb236.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}