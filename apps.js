var q = $("#searchTerm")

// API key - 9f3117485a8f44dda362d7d6f1a36c89

/**
 * pulls information from the form and build the query URL

@returns { string }
*/
function buildQueryURL() {

    var queryURL = "https://newsapi.org/v2/top-headlines?q=" + q + "&sources=associated-press&pageSize=5&X-Api-Key=9f3117485a8f44dda362d7d6f1a36c89";

    var queryParams = { "api-key": "9f3117485a8f44dda362d7d6f1a36c89" };

    // Grab text the user typed into the search input, add to the queryParams object
    queryParams.q = $("#searchTerm")
        .val()
        .trim();

    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
}





/**
* takes API data (JSON/object) and turns it into elements on the page
* @param {object} APData - object containing  API data
 */
function updatePage(APData) {
    // Get from the form the number of results to display
    // API doesn't have a "limit" parameter, so we have to do this ourselves
    var numArticles = $("#article-count").val();

    // Log the APData to console, where it will show up as an object
    console.log(APData);
    console.log("------------------------------------");

    // Loop through and build elements for the defined number of articles
    for (var i = 0; i < numArticles; i++) {
        // Get specific article info for current index
        var article = APData.response.docs[i];

        // Increase the articleCount (track article # - starting at 1)
        var articleCount = i + 1;

        // Create the  list group to contain the articles and add the article content for each
        var $articleList = $("<ul>");
        $articleList.addClass("list-group");

        // Add the newly created element to the DOM
        $("#article-section").append($articleList);

        // If the article has a headline, log and append to $articleList
        var headline = article.headline;
        var $articleListItem = $("<li class='list-group-item articleHeadline'>");

        if (headline && headline.main) {
            console.log(headline.main);
            $articleListItem.append(
                "<span class='label label-primary'>" +
                articleCount +
                "</span>" +
                "<strong> " +
                headline.main +
                "</strong>"
            );
        }

        // If the article has a byline, log and append to $articleList
        var byline = article.byline;

        if (byline && byline.original) {
            console.log(byline.original);
            $articleListItem.append("<h5>" + byline.original + "</h5>");
        }

        // Log section, and append to document if exists
        var section = article.section_name;
        console.log(article.section_name);
        if (section) {
            $articleListItem.append("<h5>Section: " + section + "</h5>");
        }

        // Log published date, and append to document if exists
        var pubDate = article.pub_date;
        console.log(article.pub_date);
        if (pubDate) {
            $articleListItem.append("<h5>" + article.pub_date + "</h5>");
        }

        // Append and log url
        $articleListItem.append("<a href='" + article.web_url + "'>" + article.web_url + "</a>");
        console.log(article.web_url);

        // Append the article
        $articleList.append($articleListItem);
    }
}

// Function to empty out the articles
function clear() {
    $("#article-section").empty();
}

// CLICK HANDLERS
// ==========================================================

// .on("click") function associated with the Search Button
$("#searchButton").on("click", function (event) {
    // This line allows us to take advantage of the HTML "submit" property
    // This way we can hit enter on the keyboard and it registers the search
    // (in addition to clicks). Prevents the page from reloading on form submit.
    event.preventDefault();

    // Empty the region associated with the articles
    clear();

    // Build the query URL for the ajax request to the NYT API
    var queryURL = buildQueryURL();

    // Make the AJAX request to the API - GETs the JSON data at the queryURL.
    // The data then gets passed as an argument to the updatePage function
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(updatePage);
});

//  .on("click") function associated with the clear button
$("#clear-all").on("click", clear);





// This searches Twitter - DO NOT CHANGE; IT FUCKING WORKS

// .on("click") function associated with the Search Button
$("#searchButton").on("click", function (event) {
    // This line allows us to take advantage of the HTML "submit" property
    // This way we can hit enter on the keyboard and it registers the search
    // (in addition to clicks). Prevents the page from reloading on form submit.
    event.preventDefault();

    var q = $("#searchTerm")
        .val()
        .trim();

    // Code below is used to pull tweets based on the search query
    $.ajax({
        url: "https://floating-brushlands-91043.herokuapp.com/cors/twitter",
        data: {
            url: "/search/tweets.json?q=" + q + "&result_type=mixed",
            key: "6C365355271AF5033FE78FCCE1DA65A85E4193B7A5C95E92F3904ED0407F9D79"
        },
        method: "POST"
    }).then(function (response) {
        // Get reference to existing tbody element, create a new table row element
        console.log(response)
    });

});