document.addEventListener('DOMContentLoaded', function onLoad(event) {

    //When the user pushes the enter key on Search bar the search button is clicked
    document.getElementById('searchTerm').addEventListener("keyup", function(event) {
        event.preventDefault()
        if (event.keyCode === 13) {
            document.getElementById("searchButton").click()
        }
    });
});

function searchLabel() {
	var searchString = $('#searchTerm').val()
	window.location = '/Labels/search/' + encodeURI(searchString)
}

function resetPage() {
    window.location = '/Labels'
}

function filterC(countryID) {
    if (countryID) {
    	window.location = '/Labels/filter/' + countryID
    }
}

function selectCountry(id) {
    if (id) {
        $("#country_Filter").val(id)
    }
}