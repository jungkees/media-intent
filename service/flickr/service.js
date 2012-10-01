// NOT CURRENTLY SUPPORTED
//  - using an extra to specify which fields are wanted
//  - passing a search
//  - a number of fields from the spec

// res.push($(this).data("person"));
// if (res.length) intent.postResult(res);
// else            intent.postFailure("No contacts selected.");

(function ($) {
    $(function () {
        var intent = window.intent || window.webkitIntent;
        var res = [];
        var items = [];
        var count = 0;
       
        $(document).ready(function () {
            if (intent) {
                //console.log("Search keyword: " + intent.data);
                $("#keyword").attr("value", intent.data);
                $("#check-all").parent().hide();
            }
        });

        $("#load-images").click(function () {
            var $keyword = $("#keyword").val();
            
            if (!$keyword) {
            	  console.log("Insert a keyword.");
                return;
            }
                
            var xmlhttp = new XMLHttpRequest();
            
            console.log("Search keyword: " + $keyword);

            xmlhttp.onreadystatechange = function() {
            	  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    $("#check-all").parent().show();

                    var resObject = eval("("+xmlhttp.responseText+")");
                    //console.log(resObject);
                    console.log(resObject.photos.photo.length + " photos found.");

                    function XHRManager() {
                    	   this.sendRequest = function(url,method, async,callback,callbackargs)
														{
														method = method ? method.toUpperCase() : "GET";
														if (typeof(callback) == "string") callback = new Function(callback);
														callback = callback || function(){};
														
														var req = this.createXMLHTTPObject();
														if (!req) callback.call(this,false,callbackargs);
														req.ref = this;
														req.open(method,url,async);
														//req.setRequestHeader('User-Agent','XMLHTTP/1.0');
														
														req.onreadystatechange = function()
															{
															if (this.readyState != 4) return;
															if (this.status != 200 && this.status != 304)
																{
																//alert("HTTP error " + req.status);
																callback.call(this.ref,false,callbackargs);
																}
															else
																{
																callback.call(this.ref,req,callbackargs);
																}
															}
														if (req.readyState == 4) return;
														req.send(null);
														}
													this.createXMLHTTPObject = function()
														{
														var xmlhttp = false;
														for (var i=0;i<this.XMLHttpFactories.length;i++)
															{
															try
																{
																xmlhttp = this.XMLHttpFactories[i]();
																}
															catch(e)
																{
																continue;
																}
															break;
															}
														return xmlhttp;
														}
													this.XMLHttpFactories = [
													function() {return new XMLHttpRequest()},
													function() {return new ActiveXObject("Msxml2.XMLHTTP")},
													function() {return new ActiveXObject("Msxml3.XMLHTTP")},
													function() {return new ActiveXObject("Microsoft.XMLHTTP")}
													];
											 }
                    var xhrManager = new XHRManager();
                    
                    $.each(resObject.photos.photo, function(i, photo) {
                        
                       
                        //var request = new XMLHttpRequest();
                        xhrManager.sendRequest('http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=407dbe13d83c8fe4f862885fd5e84457&photo_id=' + photo.id + '&secret=' + photo.secret + '&format=json&nojsoncallback=1',"get",true,display, i);
                        //request.open('GET', 'http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=407dbe13d83c8fe4f862885fd5e84457&photo_id=' + photo.id + '&secret=' + photo.secret + '&format=json&nojsoncallback=1', false);  
                        //request.send();
                    });
                    
                    var displayCount = 0;
                    function display(request, index) {
                    	   displayCount++;
											     console.log("Response.");
                            var xhrRes = eval("("+request.responseText+")");
                            //console.log(xhrRes);
                            
                            var url = "http://farm" 
                                 + xhrRes.photo.farm 
                                 + ".staticflickr.com/" 
                                 + xhrRes.photo.server + "/" 
                                 + xhrRes.photo.id + "_" 
                                 + xhrRes.photo.secret + ".jpg";
		                        //console.log(url);
		                        var mediaObject = {};
		                        var mediaContent = {};
		                        mediaContent.uri = url;
		                        mediaObject.content = mediaContent;
		
		                        var thumbnail = "http://farm" 
		                                       + xhrRes.photo.farm 
		                                       + ".staticflickr.com/" 
		                                       + xhrRes.photo.server + "/" 
		                                       + xhrRes.photo.id + "_" 
		                                       + xhrRes.photo.secret + "_t.jpg";
		                        var thumbnailObject = {};
		                        thumbnailObject.uri = thumbnail;
		                        mediaObject.thumbnail = thumbnailObject;
                        
                            mediaObject.id = xhrRes.photo.id;
                            mediaObject.description = xhrRes.photo.description._content;
                            mediaObject.title = xhrRes.photo.title._content;
                            mediaObject.type = "image";

                            mediaObject.author = xhrRes.photo.owner.username;

                            if (xhrRes.photo.location) {
                            var coords = {};
                            coords.latitude = xhrRes.photo.location.latitude;
                            coords.longitude = xhrRes.photo.location.longitude;
                            var position = {};
                            position.coords = coords;
                            mediaObject.location = position;
                            } else {
                                var coords = {};
                                coords.latitude = 0.00000;
                                coords.longitude = 0.00000;
                                var position = {};
                                position.coords = coords;
                                mediaObject.location = position;
                            }

                            mediaObject.tags = [];

                            $.each(xhrRes.photo.tags.tag, function (i, tag) {
                                mediaObject.tags.push(tag._content);
                            });
                            mediaObject.publishedDate = xhrRes.photo.dates.taken;

                            items.push(mediaObject);
																
                            var $item = $('<div style="float:left"><div align="center"><img class="thumb" src="' + thumbnail + '" title="' + xhrRes.photo.id + '" /></div><div style="font-size:70%" align="center"><input class="box" id="check_' + index + '" type="checkbox" />' + xhrRes.photo.id + '</div></div>');
                            $("#list").append($item);
                            
                            if (resObject.photos.photo.length == displayCount) {
                                console.log(items);
                                displayCount = 0;
                            }
											 }
											 
                    if (count++ == 0)
                        $("#instruction").append('<br><b>Check photos that you want to deliver to client and click on "Choose Images" button</b>');
                    
                }
            }
            
            xmlhttp.open("GET","http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=407dbe13d83c8fe4f862885fd5e84457&tags="+$keyword+"&safe_search=1&per_page=25&page=1&format=json&nojsoncallback=1",true);
            xmlhttp.send();
        });
        
        $("#choose-images").click(function () {
            $("input.box:checked").each(function (index) {
                var $title = $(this).parent().siblings().children().attr("title");
                
                $.each(items, function (i, media) {
                	  if ($title == media.id)
                        res.push(media);
                });
            });
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
}(jQuery));

