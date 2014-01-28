function InstagramViewerMap(elem, opts) {
  this._zoom = {
    _low: 5,
    _high: 14
  };
  this._map = new google.maps.Map(elem, opts);
  this._slideshow = null;
}

InstagramViewerMap.prototype = {
  initWithPosts: function(posts, slideshow) {
    this._slideshow = slideshow;

    for (var i = 0; i < posts.length; i++) {
      var post = posts[i];
      this.createMarkerForPost(post);
    }

    this.setInitialLocation(posts[0]);
  },

  setInitialLocation: function(post) {
    this.setLocation(post.location);
  },

  createMarkerForPost: function(post) {
    var map = this._map;
    var model = this;

    var loc = new google.maps.LatLng(post.location.latitude, post.location.longitude);
    var pinIcon = new google.maps.MarkerImage(post.images.thumbnail.url, null, null, null, new google.maps.Size(30, 30));

    var marker = new google.maps.Marker({
      position: loc,
      map: map,
      icon: pinIcon
    });

    marker.postId = post.id;

    google.maps.event.addListener(marker, 'click', function() {
      model._slideshow.seekToPostForPin(marker);
    });
  },

  setZoom: function(level) {
    var zoom = {
      'low' : '_low',
      'high' : '_high'
    }[level];

    this._map.setZoom(this._zoom[zoom]);
  },

  setLocation: function(location) {
    this._map.setZoom(this._zoom._high);
    this._map.panTo(new google.maps.LatLng(location.latitude, location.longitude));
  }
};
