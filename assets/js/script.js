//Constants
const searchBtnAtr = 'data-index';
const queryURL = 'https://www.loc.gov';

//Gets DOM obects.
let searchButtonEl = document.querySelector('#search-button');

init();

searchButtonEl.addEventListener('click', startSearchProcess);

//Starts the process when 'Click Me' button is clicked.
function startSearchProcess(event){
    event.preventDefault();

    let searchTextEl = document.querySelector('#search-text');
    let searchFormatEl = document.querySelector('#search-format');

    //Gets the value of search text and selection.
    let searchText = searchTextEl.value;
    let searchFormat = searchFormatEl.value;

    //Checks whether the search text is entered and selection is made.
    //Exists the function if any of the is empty.
    if(searchText === "" || searchFormat === "") return;

    //Clears the inputs on form.
    searchTextEl.value = "";
    searchFormatEl.value = "";

    //If the search button in index page is clicked, launces search result page.
    if(parseInt(searchButtonEl.getAttribute(searchBtnAtr)) === 0){
        window.location.replace(`search-results.html?search=${searchText}&format=${searchFormat}`);

    //If the search button in result page is clicked, displays the result.
    } else {
        processResults(searchText, searchFormat);
    }
}

function init(){

    //If the search button in result page is clicked, displays the result.
    //Otherwise doesn't do anything.
    if(parseInt(searchButtonEl.getAttribute(searchBtnAtr)) === 0){
        return;
    }

    //Gets query parameters from url.
    let queryParams = window.location.search.split('&');

    //Gets search text from query text.
    let searchText = queryParams[0].substring(queryParams[0].indexOf('=') + 1);

    //Gets search format from query text.
    let searchFormat = queryParams[1].substring(queryParams[1].indexOf('=') + 1);

    //Gets the search results and displays them on page.
    processResults(searchText, searchFormat);
}

//Gets the search results and displays them on page.
async function processResults(searchText, searchFormat){

    //Replaces space with '-' in search format.
    searchFormat = searchFormat.replace(' ', '-');

    //Makes the firts character lower case.
    searchFormat = searchFormat.charAt(0).toLowerCase() + searchFormat.substring(1);

    //Creates the search URL using search text and format.
    let searchURL = `${queryURL}/${searchFormat}/?q=${searchText}&fo=json`;

    //Gets the search results from local.gov.
    let congressResults = await getLocalCongressResults(searchURL);

    console.log(congressResults);
}

//Gets the search results from local.gov.
async function getLocalCongressResults(searchURL){

    const response = await fetch(searchURL);

    return response.json();
}