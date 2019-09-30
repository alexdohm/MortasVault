function load() {
    // Prevent expansion of rows for desktop sites
    $('tr[data-toggle="collapse"]').click(function (e) {
        if ($(window).width() >= 576) {
            e.stopPropagation();
        }
    });

    $('#searchButton').keypress(function (event) {
        let keyCode = (event.keyCode ? event.keyCode : event.which);
        if (keyCode === '13') {
            $('#searchButton').click();
        }
    });

    //live searching of labels
    var timeout;
    $("body").on('keyup', '#searchTerm', function () {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(function () {
            let searchString = $('#searchTerm').val();
            let data = {};
            data.searchTerm = searchString;

            $.ajax({
                type: 'POST',
                url: '/Label-Search',
                data: JSON.stringify(data),
                contentType: 'application/json; charset=utf-8'
            }).done(response => {
                $("#label-table").html(response);
            });
        }, 10);
    });

    // Arrow that moves page back to the top
    $('#return-to-top').click(function () {      // When arrow is clicked
        $('body,html').animate({
            scrollTop: 0                       // Scroll to top of body
        }, 500);
    });

    // Only enable if the document has a long scroll bar
    $(document).scroll(function() {
        let y = $(this).scrollTop();
        if (y > 300) {
            $('#return-to-top').fadeIn();
        } else {
            $('#return-to-top').fadeOut();
        }
    });

}

function expandLabel(tableRow, trigger) {
    let isExpanded = $("#" + trigger).attr("aria-expanded");
    if (isExpanded === "false") {
        $("#" + tableRow).css({"border-bottom": "1px solid white"});
    } else {
        $("#" + tableRow).css({"border-bottom": "none"});
    }
}

//prevent page refresh
$("#refreshButton").click(function (event) {
    event.preventDefault();
});

function filterC(country) {
    let data = {};
    data.searchTerm = country;

    let url_destination = '';
    if (country === '') {
        url_destination = '/Label-Search';
    } else {
        url_destination = '/Label-Country';
    }

    $.ajax({
        type: 'POST',
        url: url_destination,
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8'
    }).done(response => {
        $("#label-table").html(response);
    });
}
$('#return-to-top').hide();

//refresh page to original state
function refreshPage() {
    let data = {};
    data.searchTerm = '';

    $.ajax({
        type: 'POST',
        url: '/Label-Search',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8'
    }).done(response => {
        $("#label-table").html(response);
    });
}