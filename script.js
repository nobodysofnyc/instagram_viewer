$(document).ready(function() {

  $('#tag').bind('keydown', function(e) {
    var val = $(this).val();
    if (val.length == 1 && val == "#" && e.keyCode == 8) {
      $(this).val('##');
    }
    if (val.length == 0) {
      $(this).val('#');
    }
  });

  $('#tag').bind('keyup', function() {
    if ($(this).val().length === 0) {
      $(this).val('#');
    }
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
