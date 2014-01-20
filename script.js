$(document).ready(function() {

  $('#tag').bind('keydown', function(e) {
    var $self = $(this);
    var val = $self.val();
    if (val.length == 1 && val == "#" && e.keyCode == 8) {
      $self.val('##');
    }
    if (val.length == 0) {
      $self.val('#');
    }
    if (val.charAt(0) !== "#") {
      var newStr = "#" + val;
      $self.val(newStr);
    }
  });

  $('#tag').bind('keyup', function() {
    var $self = $(this);
    var val = $self.val();
    if (val.length === 0) {
      $(this).val('#');
    }
  });

  $('#submit').bind('click', function() {
    $('#images').empty();

    var tag = $('#tag').val().replace('#', '');
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
