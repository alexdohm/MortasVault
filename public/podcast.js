document.addEventListener('DOMContentLoaded', function onLoad(event) {

    //When the user pushes the enter key on Search bar the search button is clicked
    document.getElementById('searchTerm').addEventListener("keyup", function(event) {
        event.preventDefault()
        if (event.keyCode === 13) {
            document.getElementById("searchButton").click()
        }
    });
});

function searchPodcast() {
	var searchString = $('#searchTerm').val()
	window.location = '/Podcasts/search/' + encodeURI(searchString)
}

function resetPage() {
    window.location = '/Podcasts'
}

function filterC(countryID) {
    if (countryID) {
    	window.location = '/Podcasts/filter/' + countryID
    }
}

function selectCountry(id) {
    if (id) {
        $("#country_Filter").val(id)
    }
}