/*
 *  make sure to clear these variables after each go around
 */

$(document).ready(function() {

  $('#submit').bind('click', function() {
    $('#images').empty();

    var tag = $('#tag').val();
    var username = $('#username').val();

    var success = function(obj) {
      
      for (var i = 0; i < obj.postsFilteredByTag.length; i++) {
        var post = obj.postsFilteredByTag[i];
        var src = post.images.standard_resolution.url;
        var img = $('<img class="insta-image" src="' + src + '">');
        $('#images').append(img);
      }

    }

    var query = new InstagramQuery(username, tag, success);
  });
});