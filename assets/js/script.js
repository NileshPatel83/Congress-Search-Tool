//Constants
const searchBtnAtr = 'data-index';
const queryURL = 'https://www.loc.gov';

//Gets DOM obects.
let searchButtonEl = document.querySelector('#search-button');
let searchTextEl = document.getElementById('search-text');
let searchFormatEl = document.getElementById('search-format');

init();

searchButtonEl.addEventListener('click', startSearchProcess);

//Starts the process when 'Click Me' button is clicked.
function startSearchProcess(event){

    event.preventDefault();

    //Gets the value of search text and selection.
    let searchText = searchTextEl.value;
    let searchFormat = searchFormatEl.value;

    //Checks whether the search text is entered and selection is made.
    //Exists the function if any of the is empty.
    if(searchText === '' || searchFormat === '') return;

    //Clears the inputs on form.
    searchTextEl.value = '';
    searchFormatEl.value = '';

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

    //Clears the inputs on form.
    searchTextEl.value = searchText;
    searchFormatEl.value = searchFormat;

    //Gets the search results and displays them on page.
    processResults(searchText, searchFormat);
}

//Gets the search results and displays them on page.
async function processResults(searchText, searchFormat){

    //Displays search text heading.
    displaySearchText(searchText);

    //Replaces space with '-' in search format.
    searchFormat = searchFormat.replace(' ', '-');

    //Makes the firts character lower case.
    searchFormat = searchFormat.charAt(0).toLowerCase() + searchFormat.substring(1);

    //Creates the search URL using search text and format.
    let searchURL = `${queryURL}/${searchFormat}/?q=${searchText}&fo=json`;

    //Gets the search results from local.gov.
    let congressResults = await getLocalCongressResults(searchURL);
    if(typeof(congressResults) === 'undefined') return;

    //Displays search results.
    dispalySearchResults(congressResults);
}

//Displays search results.
function dispalySearchResults(congressResults){

    //Gets the container div element. All search results will be displayed in this div.
    let resultContainerEl = document.getElementById('result-content');

    //Displays no result found if fails to find any result.
    if(congressResults.results.length === 0){

        let noResultHeadingEl = document.createElement('h3');
        noResultHeadingEl.classList.add('result-heading'); 
        noResultHeadingEl.style.color = 'white';
        noResultHeadingEl.style.marginLeft = '1rem';
        noResultHeadingEl.textContent = 'Sorry, No results found.';

        resultContainerEl.append(noResultHeadingEl);

        return;
    }

    //Loops throgh all resutls and displays them on page.
    for (let i = 0; i < congressResults.results.length; i++) {
       
        let result = congressResults.results[i];

        //Sets the title value to title.
        //If title value is empty then sets the value to 'No Title.'
        let title = 'No Title';
        if(typeof(result.title) !== 'undefined') {
            title = result.title;
        }
        
        //Sets the date value.
        //If date value is empty then sets the value to 'No Date.'
        let date = 'No Date';
        if(typeof(result.date) !== 'undefined') date = result.date;

        //Sets the subject value.
        //If subject value is empty then sets the value to 'No Subject.'
        let subject = 'No Subject';
        if(typeof(result.subject) !== 'undefined') {
            subject = result.subject.join(', ');
        }

        //Sets the description value.
        //If description value is empty then sets the value to 'No Description.'
        let description = 'No Description';
        if(typeof(result.description) !== 'undefined') {
            description = result.description;
        }

        //Set the id value.
        //This value is URL for the search.
        let id = '#';
        if(typeof(result.id) !== 'undefined') id = result.id;

        //Creates an outer div that contains heading, date, subject and description.
        let outerDivEl = document.createElement('div');
        outerDivEl.classList.add('result'); 

        //Creates heading element and sets the value to title.
        let resultHeadingEl = document.createElement('h3');
        resultHeadingEl.classList.add('result-heading'); 
        resultHeadingEl.textContent = title;

        //Creates date text element.
        let resultDateEl = document.createElement('div');
        resultDateEl.textContent = 'Date: ';
        resultDateEl.classList.add('result-date'); 

        //Creates date value element and sets the value to date.
        let dateSpanEl = document.createElement('span');     
        dateSpanEl.textContent = date;
        dateSpanEl.classList.add('font-normal'); 

        //Adds date value to date text.
        resultDateEl.append(dateSpanEl);

        //Creates subject text element.
        let resultSubjectEl = document.createElement('div');
        resultSubjectEl.textContent = 'Subjects: ';
        resultSubjectEl.classList.add('result-subject'); 

        //Creates subject value element and sets the value to subject.
        let subjectSpanEl = document.createElement('span');     
        subjectSpanEl.textContent = subject;
        subjectSpanEl.classList.add('font-normal'); 

        //Adds subject value to subject text.
        resultSubjectEl.append(subjectSpanEl);

        //Creates description text element.
        let resultDescEl = document.createElement('div');
        resultDescEl.textContent = 'Description: ';
        resultDescEl.classList.add('result-description'); 

        //Creates description value element and sets the value to description.
        let descSpanEl = document.createElement('span');     
        descSpanEl.textContent = description;
        descSpanEl.classList.add('font-normal'); 

        //Adds description value to description text.
        resultDescEl.append(descSpanEl);

        //Creates 'Read More' button.
        let readMoreBtnEl = document.createElement('button');
        readMoreBtnEl.classList.add('readmore-button'); 

        //Creates anchor tag for read me button for search result.
        let readMoreAnchorEl = document.createElement('a');
        readMoreAnchorEl.setAttribute('href', id);
        readMoreAnchorEl.setAttribute('target','_blank');
        readMoreAnchorEl.innerText = 'Read More';

        //Adds anchor tag to read me button.
        readMoreBtnEl.append(readMoreAnchorEl);

        //Adds heading, date, subject and description elements to outer div element.
        outerDivEl.append(resultHeadingEl, resultDateEl, resultSubjectEl, resultDescEl, readMoreBtnEl);

        //Adds outer div to result container.
        resultContainerEl.append(outerDivEl);
    }

}

//Displays search text heading.
function displaySearchText(searchText){

    //Gets the search heading span element.
    let spanEl = document.getElementById('result-text-span');
    spanEl.textContent = `'${searchText}'`;

    //Sets the left margin to 0 as default left margin is applied through style.css.
    spanEl.style.marginLeft = 0;
}

//Gets the search results from local.gov.
async function getLocalCongressResults(searchURL){

    const response = await fetch(searchURL);

    return response.json();
}