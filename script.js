$(document).ready(function() {
  $('#tag').bind('keyup', function(e) {
    var k = e.keyCode;
    if (k === 91 || k === 37 || k == 38 || k == 39 || k == 40 || k == 9) return;
    $(this).val("#" + $(this).val().replace(/#| /g, ''));
  });

  $('#submit').bind('click', function() {
    $('#images').empty();

    var tag = $('#tag').val().replace('#', '');
    var username = $('#username').val();

    var success = function(obj) {
      for (var i = 0; i < obj._postsFilteredByTag.length; i++) {
        var post = obj._postsFilteredByTag[i];
        var src = post.images.standard_resolution.url;
        var img = $('<img data-id="'+ post.id +'" class="insta-image" src="' + src + '">');
        $('#images').append(img);
      }
    }

    // new InstagramQuery(username, tag, limit, success)
    var query = new InstagramQuery(username, tag, 100, success);
  });

  $(document).bind('keypress', function(e) {
    if (e.keyCode == 13) {
      $('#submit').trigger('click');
    }
  });
});
