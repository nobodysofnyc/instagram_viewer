function InstagramSlideshow(obj) {
  this.posts = obj._postsFilteredByTag;
  this.init();
}

InstagramSlideshow.prototype = {
  init: function() {
    for (var i = 0; i < this.posts.length; i++) {
      var post = this.posts[i];
      var src = post.images.standard_resolution.url;
      var tags = JSON.stringify(post.tags);
      var img = $('<img data-id="'+ post.id +'" data-tags="'+ tags +'" class="insta-image" src="' + src + '">');
      $('#images').append(img);
    }
  }
};
