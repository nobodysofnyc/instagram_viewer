function ensureHashTag($elem, e) {
  var k = e.keyCode;
  if (k == 91 || k == 37 || k == 38 || k == 39 || k == 40 || k == 9) {
    return;
  } else {
    $elem.val("#" + $elem.val().replace(/#| /g, ''));
  }
}

$(document).ready(function() {

  $('#tag').bind('keyup', function(e) {
    ensureHashTag($(this), e);
  });

  $('#submit').bind('click', function() {
    $('#images').empty();

    var tag = $('#tag').val().replace('#', '');
    var username = $('#username').val();

    var success = function(obj) {
      var slideshow = new InstagramSlideshow(obj);
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
