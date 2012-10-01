// service.js

(function($) {
    $(function () {
        $(document).ready(function () {
            if (intent) {
                // console.log(intent.data);
                $("#keyword").attr("value", intent.data);
                $("#check-all").parent().hide();
            }
        });	
	      $("#load-videos").click(function () {
	      	   var $keyword = $("#keyword").val();
	      	   if (!$keyword) {
            	  console.log("Insert a keyword.");
                return;
            }
            
	  	      console.log("Search keyword: " + $("#keyword").val());
            var uri = "https://gdata.youtube.com/feeds/api/videos?q="+$("#keyword").val()+"&v=2&alt=jsonc&callback=listEvents"
            var body = document.getElementsByTagName('body')[0];
            var script = document.createElement('script');
            script.src = uri;
            console.log("YouTube API:" + uri);
            body.appendChild(script);
	      });
	      $("#choose-videos").click(function () {
        	  //console.log("choose-videos");
            $("input.box:checked").each(function (index) {
                var $title = $(this).parent().siblings().children().attr("title");

                $.each(items, function (i, media) {
                    if ($title == media.id)
                        res.push(media);
                });
            });
            //console.log(res);
            intent.postResult(res);
        });

        $("#cancel").click(function () {
            intent.postFailure("User canceled selection.");
        });

        $("#check-all").click(function () {
            if ($(this).is(":checked")) {
                $("input:checkbox:not(checked)").attr("checked", true);
            } else {
                $("input:checkbox:checked").attr("checked", false);
            }
        });
    });
})(jQuery);
