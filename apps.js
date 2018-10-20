var q = $("#searchTerm").val();

// API key - 9f3117485a8f44dda362d7d6f1a36c89

/**
 * pulls information from the form and build the query URL

@returns { string }
*/
function buildQueryURL(source) {

    var queryURL = "https://newsapi.org/v2/top-headlines?q=" + q + "&sources=" + source + "&pageSize=1&";

    var queryParams = { "apiKey": "9f3117485a8f44dda362d7d6f1a36c89" };

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
* @param {object} newsData - object containing  API data
 */
function updateAP(newsData) {
    // Get from the form the number of results to display
    // API doesn't have a "limit" parameter, so we have to do this ourselves
    // var numArticles = $("#article-count").val();

    // Log the newsData to console, where it will show up as an object
    console.log(newsData);
    console.log("------------------------------------");

    // Loop through and build elements for the defined number of articles
    for (var i = 0; i < newsData.articles.length; i++) {
        // Get specific article info for current index
        var article = newsData.articles[i];

        // Increase the articleCount (track article # - starting at 1)


        // Create the  list group to contain the articles and add the article content for each
        var $articleList = $("<ul>");
        $articleList.addClass("list-group");

        // Add the newly created element to the DOM
        $("#article-section").append($articleList);

        // If the article has a headline, log and append to $articleList
        var title = article.title;
        var $articleListItem = $("<li class='list-group-item articleTitle'>");

        
        var spectrum = ["Liberal", "Neutral", "Conservative"];
        var reporter = ["MSNBC", "Associated Press", "Fox News"];
        

        if (title && article.title) {
            console.log(article.title);
            $articleListItem.append(
                "<h3>" + 
                spectrum + 
                " Media " + 
                reporter + 
                "<h3>" +
                "<h4> " +
                article.title +
                "</h4>"
            );
        }


        // If the article has a byline, log and append to $articleList
        var description = article.description;

        if (description) {
            console.log(description);
            $articleListItem.append("<h6>" + description + "</h6>");
        }

        // Log section, and append to document if exists
        var url = article.url;
        console.log(article.url);
        if (url) {
            $articleListItem.append("<h6>URL: " + url + "</h6>");
        }

        // Log published date, and append to document if exists
        var pubDate = article.publishedAt;
        console.log(article.publishedAt);
        if (pubDate) {
            $articleListItem.append("<h8>" + article.publishedAt + "</h8>");
        }


        // Append the article
        $articleList.append($articleListItem);
    }
}

/**
* takes API data (JSON/object) and turns it into elements on the page
* @param {object} TwitterData - object containing  API data
 */
function updateTwitter(TwitterData) {
    // Get from the form the number of results to display
    // API doesn't have a "limit" parameter, so we have to do this ourselves
    // var numArticles = $("#article-count").val();

    // Log the newsData to console, where it will show up as an object
    console.log(TwitterData.statuses[0].user.name);
    console.log("------------------------------------");

    // Loop through and build elements for the defined number of articles
    for (var i = 0; i < TwitterData.statuses.length; i++) {
        // Get specific article info for current index
        var article = TwitterData.statuses[i];

        // Increase the articleCount (track article # - starting at 1)


        // Create the  list group to contain the articles and add the article content for each
        var $articleList = $("<ul>");
        $articleList.addClass("list-group");

        // Add the newly created element to the DOM
        $("#tweet-section").append($articleList);

        // If the article has a headline, log and append to $articleList
        var tweet = article.text;
        var $articleListItem = $("<li class='list-group-item articleTitle'>");

        if (tweet && article.text) {
            console.log(article.text);
            $articleListItem.append(
                "<h5> " +
                article.text +
                "</h5>"
            );
        }

        // If the article has a byline, log and append to $articleList
        var user = article.user.name;

        if (user) {
            console.log(user);
            $articleListItem.append("<h6>" + user + "</h6>");
        }

        // Log section, and append to document if exists
        var retweetCount = article.retweet_count;
        console.log(article.retweet_count);
        if (retweetCount) {
            $articleListItem.append("<h6>Retweet Count: " + retweetCount + "</h6>");
        }


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
    var source = ["msnbc", "associated-press", "fox-news"];

    for (var i = 0; i < source.length; i++) {
        $.ajax({
            url: buildQueryURL(source[i]),
            method: "GET"
        }).then(updateAP);
    }
});


//  .on("click") function associated with the clear button
$("#clear-all").on("click", clear);





// This searches Twitter - DO NOT CHANGE
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
    }).then(updateTwitter);
    // Get reference to existing tbody element, create a new table row eleme

});