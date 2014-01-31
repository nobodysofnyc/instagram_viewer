var map;

function ensureHashTag($elem, e) {
  var k = e.keyCode;
  if (k == 91 || k == 37 || k == 38 || k == 39 || k == 40 || k == 9) {
    return;
  } else {
    $elem.val("#" + $elem.val().replace(/#| /g, ''));
  }
}

$(document).ready(function() {

  var NY = {
    lat: 40.719729,
    lng: -73.988549
  }

  var mapOpts = {
    center: new google.maps.LatLng(NY.lat, NY.lng),
    zoom : 10,
    disableDefaultUI: true
  };

  map = new InstagramViewerMap($('#map')[0], mapOpts);

  $('#tag').bind('keyup', function(e) {
    ensureHashTag($(this), e);
  });

  $('#submit').bind('click', function() {
    $('#images').empty();

    var tag = $('#tag').val().replace('#', '');
    var username = $('#username').val();

    var success = function(obj) {
      var slideshow = new InstagramSlideshow(obj, map);
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
