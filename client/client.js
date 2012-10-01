(function ($) {
    var Intent = window.Intent || window.WebKitIntent
    ,   startActivity = (window.navigator.startActivity 
                      || window.navigator.webkitStartActivity).bind(window.navigator)
    ;
    var mediaObjectArray = [];

    $("#load-media").click(function () {
        $("#error").remove();
        var ci = new Intent("http://webintents.org/pick"
                           , "http://w3.org/types/media"
                           , $("#keyword").val())
                           ;
        startActivity(ci
                ,   function (data) {
                        mediaObjectArray = mediaObjectArray.concat(data);
                        console.log(data.length + " media objects received; total " + mediaObjectArray.length + " media objects are in virtual gallery.");
                        console.log(data);
                        $.each(data, function (i, media) {
                            var $item = $('<div style="float:left"><div align="center"><img class="thumb" src="' + media.thumbnail.uri + '" title="' + media.title + '" /></div><div style="font-size:70%; float:left; width:100px; overflow:hidden; white-space:nowrap;" align="center">' + media.title + '</div></div>');
                            $("#list").append($item);
                        });
                    }
                ,   function (err) {
                        $("h1").after("<div id='error'>" + err + "</div>");
                });
    });
    $("img.thumb").live("click", function () {
        var $uri = $(this).attr("src");
        $("#bg").css("display", "block");
       
        $.each(mediaObjectArray, function(i, media) {
            if ($uri == media.thumbnail.uri) {
                if (media.type == "video") { // video
                    $("#originalVideo").attr("src", media.content.uri);
                    $("#metaData-videos").append('<br><b>Title: </b><em>' + media.title
                        + '</em><br>' + '<b>Description: </b><em>' + media.description
                        + '</em><br>' + '<b>Author: </b><em>' + media.author
                        + '</em><br>' + '<b>Duration: </b><em>' + media.duration
                        + ' sec.</em><br>' + '<b>Location: </b><a target="_blank" href="http://maps.google.com/maps?q=' + media.location.coords.latitude + "," + media.location.coords.longitude + '&ll=' + media.location.coords.latitude + "," + media.location.coords.longitude + '&radius=5"><em>' + media.location.coords.latitude + ", " + media.location.coords.longitude
                        + '</em></a><br>' + '<b>Like count: </b><em>' + media.likeCount
                        + '</em><br>' + '<b>Rating: </b><em>' + media.rating
                        + '</em><br>' + '<b>Rating count: </b><em>' + media.ratingCount
                        + '</em><br>' + '<b>View count: </b><em>' + media.viewCount
                        + '</em><br>' + '<b>Tags: </b><em>' + media.tags
                        + '</em><br>' + '<b>Published date: </b><em>' + media.publishedDate
                        + '</em><br>' + '<b>Copyright: </b><em>' + media.copyright + '</em>'
                    );
                    $("#popup-videos").css("display", "block");
                } else {
                	  // console.log($(this)); // EXIF.getTag($("#aaa"), "Make"));
                    $("#originalImage").attr("src", media.content.uri);
                    $("#metaData-images").append('<br><b>Title: </b><em>' + media.title
                        + '</em><br>' + '<b>Description: </b><em>' + media.description
                        + '</em><br>' + '<b>Author: </b><em>' + media.author
                        + '</em><br>' + '<b>Location: </b><a target="_blank" href="http://maps.google.com/maps?q=' + media.location.coords.latitude + "," + media.location.coords.longitude + '&ll=' + media.location.coords.latitude + "," + media.location.coords.longitude + '&radius=5"><em>' + media.location.coords.latitude + ", " + media.location.coords.longitude
                        + '</em></a><br>' + '<b>Tags: </b><em>' + media.tags
                        + '</em><br>' + '<b>Published date: </b><em>' + media.publishedDate
                        + '</em><br>' + '<b>Copyright: </b><em>' + media.copyright + '</em>'
                    );
                    $("#popup-images").css("display", "block");
                }
            }
        });
    });
    $("#reset").click(function () {
    	  $("#list").children().remove();
        mediaObjectArray = [];
    });
}(jQuery));
