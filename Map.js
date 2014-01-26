function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(40.719729, -73.988549),
    zoom : 3,
    disableDefaultUI: true
  };
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);
