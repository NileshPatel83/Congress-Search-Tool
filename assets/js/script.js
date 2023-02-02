//Constants
const searchBtnAtr = 'data-index';

//Gets DOM obects.
let searchButtonEl = document.querySelector('#search-button');

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

        window.location.replace('search-results.html');
    }
}