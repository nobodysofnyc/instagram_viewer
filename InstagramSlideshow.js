function InstagramSlideshow(obj, map) {
  this._posts = obj._postsFilteredByTag;
  this._postsCount = this._posts.length;
  this._idx = 0;
  this._$window = $(window);
  this._windowWidth = this._$window.width();
  this._windowHeight = this._$window.height();
  this._map = map;

  this.init();
  this.bindEvents();
}

InstagramSlideshow.prototype = {
  init: function() {

    // cache the body selector
    var $posts = $('#posts');

    // loop through all posts and create a slideshow
    for (var i = 0; i < this._posts.length; i++) {

      // get the current post (posts[i])
      var post = this._posts[i];

      if (!this.postHasLocation(post)) continue;

      // calculate the left for the current slideshow post
      var left = this._windowWidth * i;

      // get the data for our post and create an <img> element with said data
      var src = post.images.standard_resolution.url;
      // JSON.stringify turns a data object into a string (eg. [] to "[]")
      var tags = JSON.stringify(post.tags);
      var $img = $('<img data-id="'+ post.id +'" data-tags="'+ tags +'" class="insta-image" src="' + src + '">');

      // create a few empty divs
      var $post = $('<div class="post"></div>');
      var $postBg = $('<div class="post-bg"></div>');
      var $container = $('<div class="post-image-container"></div>');
      var $postImg = $('<div class="post-image"></div>');

      // add the <img> to the post-image div
      $postImg.html($img);

      // add the post-image div to the post-image-container div
      $container.html($postImg);

      // ad the post-image-container div to the post div
      $post.html($container);
      $post.prepend($postBg);

      // set some dynamic styles on the post div
      $post.css({
        'left' : left,
        'width' : this._windowWidth,
        'height' : this._windowHeight
      });

      // append this post to the body
      $posts.append($post);
    }

    this._map.initWithPosts(this._posts, this);
  },

  nextPost: function() {
    this._idx++;

    if (this._idx > this._postsCount - 1) {
      this._idx = 0;
    }

    this.seekToPost();
  },

  previousPost: function() {
    this._idx--;

    if (this._idx < 0) {
      this._idx = this._postsCount - 1;
    }

    this.seekToPost();
  },

  seekToPost: function(idx) {
    var slideshow = this;

    if (typeof idx == "number") {
      this._idx = idx;
    }

    var $posts = $('.post');
    $posts.each(function(idx, post) {
      var $post = $(post);
      var left =  - (slideshow._idx * slideshow._windowWidth);
      $post.css({
        '-webkit-transform' : 'translate3d('+left+'px, 0px, 0px)'
      });
    });

    this.seekToLocation(this._posts[this._idx]);
  },

  seekToLocation: function(post) {
    this._map.setLocation(post.location);
  },

  postHasLocation: function(post) {
    return post.location && post.location.longitude && post.location.latitude;
  },

  seekToPostForPin: function(marker) {
    var idx = 0;
    for (var i = 0; i < this._posts.length; i++) {
      if (this._posts[i].id === marker.postId) {
        idx = i;
        break;
      }
    }

    console.log(idx);
    this.seekToPost(idx);
    this.showSlideshow();
  },

  showSlideshow: function() {
    var $posts = $('#posts');
    $posts.show();
  },

  hideSlideshow: function() {
    var $posts = $('#posts');
    $posts.hide();
  },

  bindEvents: function() {
    var slideshow = this;

    var $posts = $('.post');
    this._$window.bind('resize.slideshow', function() {
      var width = $(this).width();
      var height = $(this).height();
      $posts.each(function(idx) {
        $(this).css({
          'width' : width,
          'left' : idx * width,
          'height' : height
        });
      });
    });

    $('#posts').on('click', '.post-bg', function() {
      slideshow.hideSlideshow();
    });

    $(document).bind('keyup', function(e) {
      if (e.keyCode === 37) {
        slideshow.previousPost();
      } else if (e.keyCode === 39) {
        slideshow.nextPost();
      }
    });
  }
};
