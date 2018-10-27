
var really_i = 0;

$(document).ready(function () {

    $("#results").hide();
    $("#tweets").hide();



    /**
     * pulls information from the form and build the query URL
    
    @returns { string }
    */
    function buildQueryURL(source) {
        var q = $("#searchTerm").val();
        var queryURL = "https://newsapi.org/v2/everything?q=" + q + "&domains=" + source + "&pageSize=1&";

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


        // Log the newsData to console, where it will show up as an object
        console.log(newsData);
        console.log("------------------------------------");

        // Loop through and build elements for the defined number of articles
        for (var i = 0; i < newsData.articles.length; i++) {
            // Get specific article info for current index
            var article = newsData.articles[i];

            // Increase the articleCount (track article # - starting at 1)


            // Create the  list group to contain the articles and add the article content for each
            var $articleList = $("<td>");
            $articleList.addClass("animated fadeIn");
            

            // Add the newly created element to the DOM
            $("#article-section").append($articleList);

            // If the article has a title, log and append to $articleList
            var title = article.title;
            var $articleListItem = $("<p class='list-group-item articleTitle'>");

            var spectrum = ["Liberal ", "Neutral ", "Conservative "];

            if (title && article.title) {
                console.log(article.title);
                $articleListItem.append(
                    "<p id='spectrum'>" +
                    spectrum[really_i] +

                    "<p id='sourceName'>" +
                    article.source.name +

                    "<p id='articleTitle>" +
                    article.title

                );
            }


            // If the article has a description, log and append to $articleList
            var description = article.description;

            if (description) {
                console.log(description);
                $articleListItem.append("<p id='description'>" + description + "</p>");
            }

            // Log source, and append to document if exists
            var url = article.url;

            console.log(article.url);
            if (url) {
                $articleListItem.append("<p id='source'><a href=" + url + ">" + "Source" + "</a></p>");
            }




            // Append the article
            $articleList.append($articleListItem);
        }

        really_i++;

        $("#img").hide();
        $("#searchingOnly").hide();



    }

    /**
    * takes API data (JSON/object) and turns it into elements on the page
    * @param {object} TwitterData - object containing  API data
     */
    function updateTwitter(TwitterData) {
        // Get from the form the number of results to display


        // Log the TwitterData to console, where it will show up as an object
        console.log(TwitterData.statuses[0].user.name);
        console.log("------------------------------------");

        // Loop through and build elements for the defined number of articles
        for (var i = 0; i < TwitterData.statuses.length; i++) {
            // Get specific article info for current index
            var article = TwitterData.statuses[i];

            // Increase the articleCount (track article # - starting at 1)


            // Create the  list group to contain the articles and add the article content for each
            var $articleList = $("<td id='tweet'>");
            $articleList.addClass("tweet-group");


            // Add the newly created element to the DOM
            $("#tweet-section").append($articleList);

            // If the tweet has text, log and append to $articleList
            var tweet = article.text;
            var $articleListItem = $("<p class='tweet-group-item articleTitle'>");

            if (tweet && article.text) {
                console.log(article.text);
                $articleListItem.append(
                    "<p id='tweetText'> " +
                    article.text +
                    "</p>"
                );
            }

            // If the tweet has a user ID, log and append to $articleList
            var user = article.user.name;

            if (user) {
                console.log(user);
                $articleListItem.append("<p id='user'>" + user + "</p>");
            }

            // If the tweet has retweets, log and append to $articleList
            var retweetCount = article.retweet_count;
            console.log(article.retweet_count);
            if (retweetCount) {
                $articleListItem.append("<p id='retweetCount'>Retweet Count: " + retweetCount + "</p>" + "<br>");
            }


            // Append the article
            $articleList.append($articleListItem);


        }
    }



    // CLICK HANDLERS
    // ==========================================================
    $('#searchTerm').keyup(function () {
        if ($(this).val() == '') {
            $('#searchButton').prop('disabled', true);
        } else {
            $('#searchButton').prop('disabled', false);
        }
    }).keyup();


    // .on("click") function associated with the Search Button
    $("#searchButton").on("click", function (event) {
        // This line allows us to take advantage of the HTML "submit" property
        // This way we can hit enter on the keyboard and it registers the search
        // (in addition to clicks). Prevents the page from reloading on form submit.
        event.preventDefault();





        $("#results").show();
        $("#tweets").show();
        $("#resetButton").show();


        // Make the AJAX request to the API - GETs the JSON data at the queryURL.
        // The data then gets passed as an argument to the updatePage function
        var source = ["msnbc.com", "apnews.com", "foxnews.com"];

        for (var i = 0; i < source.length; i++) {
            var result = JSON.parse(
                $.ajax({
                    url: buildQueryURL(source[i]),
                    method: "GET",
                    async: false,
                }).responseText
            );

            updateAP(result);
        }
    });







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

        resetButton = "<p class='text-center reset-button-container animated fadeIn'><a class='btn btn-dark btn-lg reset-button' href='#' role='button' id='resetButton'>Reset</a></p>";
        $(".container").html(resetButton);
    });




    // Function to empty out the articles
    function clear() {


        $("body").on("click", ".reset-button", function (event) {
            
            $('body').fadeOut(800, function(){
                window.location.reload(true);
            });
        });

    }


    // Empty the region associated with the articles
    clear();

});

