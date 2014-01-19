$(document).ready(function() {

  $('#tag').bind('keyup', function(){
      var sanitized = $(this).val().replace(/[^0-1a-z]/g,'');
      $(this).val('#' + sanitized);
  });

  $('#submit').bind('click', function() {
    $('#images').empty();

    var tag = $('#tag').val();
    var username = $('#username').val();

    var success = function(obj) {
      for (var i = 0; i < obj._postsFilteredByTag.length; i++) {
        var post = obj._postsFilteredByTag[i];
        var src = post.images.standard_resolution.url;
        var img = $('<img class="insta-image" src="' + src + '">');
        $('#images').append(img);
      }
    }

    // new InstagramQuery(username, tag, type, success)
    var query = new InstagramQuery(username, tag, "username|tag", success);
  });

  $(document).bind('keypress', function(e) {
    if (e.keyCode == 13) {
      $('#submit').trigger('click');
    }
  });
});
