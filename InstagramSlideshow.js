function InstagramSlideshow(obj) {
  this._posts = obj._postsFilteredByTag;
  this._postsCount = this._posts.length;
  this._idx = 0;
  this._$window = $(window);
  this._windowWidth = this._$window.width();
  this._windowHeight = this._$window.height();

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

      // calculate the left for the current slideshow post
      var left = this._windowWidth * i;

      // get the data for our post and create an <img> element with said data
      var src = post.images.standard_resolution.url;
      // JSON.stringify turns a data object into a string (eg. [] to "[]")
      var tags = JSON.stringify(post.tags);
      var $img = $('<img data-id="'+ post.id +'" data-tags="'+ tags +'" class="insta-image" src="' + src + '">');

      // create a few empty divs
      var $post = $('<div class="post"></div>');
      var $container = $('<div class="post-image-container"></div>');
      var $postImg = $('<div class="post-image"></div>');

      // add the <img> to the post-image div
      $postImg.html($img);

      // add the post-image div to the post-image-container div
      $container.html($postImg);

      // ad the post-image-container div to the post div
      $post.html($container);

      // set some dynamic styles on the post div
      $post.css({
        'left' : left,
        'width' : this._windowWidth,
        'height' : this._windowHeight
      });

      // append this post to the body
      $posts.append($post);
    }
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

  seekToPost: function() {
    var $posts = $('.post');
    $posts.each(function(idx, post) {
      var left = parseInt($(post).css('left').replace('px', ''), 10);
      console.log(left);
    });
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

    $(document).bind('keyup', function(e) {
      if (e.keyCode === 37) {
        slideshow.previousPost();
      } else if (e.keyCode === 39) {
        slideshow.nextPost();
      }
    });
  }
};
