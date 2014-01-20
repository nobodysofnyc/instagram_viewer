function doThisWhenDone(obj) {
  for (var i = 0; i < obj._postsFilteredByTag.length; i++) {
    var post = obj._postsFilteredByTag[i];
    var src = post.images.standard_resolution.url;
    var tags = JSON.stringify(post.tags);
    var img = $('<img data-id="'+ post.id +'" data-tags="'+ tags +'" class="insta-image" src="' + src + '">');
    $('#images').append(img);
  }
}

function ensureHashTag($elem, e) {
  var k = e.keyCode;
  if (k === 91 || k === 37 || k == 38 || k == 39 || k == 40 || k == 9) return;
  $elem.val("#" + $elem.val().replace(/#| /g, ''));
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
      doThisWhenDone(obj);
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
