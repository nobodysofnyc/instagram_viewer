function InstagramQuery(username, tag, success) {
  this.checkIdx = 0;
  this.userData;
  this.tagData;
  this.userId;
  this.username = username || "mikekavouras";
  this.tag = tag || "honeysmoon";
  this.hasPostsFilteredByTag = false;
  this.success = success;
  this.postsFilteredByTag;

  this.fetchData();
}

InstagramQuery.prototype = {
  fetchData: function() {
    this.getUserId();
    this.getFeedTag();
  },

  checkIfFetchIsDone: function() {
    if (this.checkIdx < 3) {
      return;
    } 

    this.filterPostsByTag();
  },

  filterPostsByTag: function() {
    if (this.filteredData) {
      return this.filteredData;
    }

    var filteredUserData = [];

    for (var i = 0; i < this.userData.length; i++) {
      var post = this.userData[i];
      var tags = post.tags;
      if (tags.length > 0) {
        for (var j = 0; j < tags.length; j++) {
          if (tags[j] == this.tag) {
            filteredUserData.push (post);
            break;
          }
        }
      }
    }

    var filteredTagData = [];

    for (var i = 0; i < this.tagData.length; i++) {
      var post = this.tagData[i];
      var id = post.user.id;
      if (id == this.userId) {
        filteredTagData.push(post);
      }
    }

    userData = [];
    tagData = [];

    var finalData = filteredUserData;

    // loop the the result of that stuff ^^^ and filter out duplicates

    for (var i = 0; i < filteredTagData.length; i++) {
      var tagPost = filteredTagData[i];
      var tagPostId = tagPost.id;
      for (var j = 0; j < filteredUserData.length; j++) {
        var userPost = filteredUserData[j];
        var userPostId = userPost.id;
        if (userPostId == tagPostId) {
          break;
        } else {
          finalData.push(tagPost);
        }
      }
    }

    this.postsFilteredByTag = finalData;
    this.hasPostsFilteredByTag = true;

    if (this.success)
      this.success(this);
  },

  getUserId: function(username) {
    var self = this;
    username = username || this.username;
    $.ajax({
      url: self.instagramUserIdUrl(),
      type: "get",
      dataType: "jsonp",
      success: function(response) {
        var data = response.data;
        if (data.length > 0) {
          var user = data[0];
          var id = user.id;

          self.checkIdx++;
          self.userId = id;
          self.getUserFeed();
        } else {
          alert ("No user found.");
        }

      },
      fail: function(response) {
      }
    })
  },

  getUserFeed: function() {
    var self = this;

    $.ajax({
      url: self.instagramUserFeedUrl(),
      type: "get",
      dataType: "jsonp",
      success: function(response) {
        self.userData = response.data;
        self.checkIdx++;
        self.checkIfFetchIsDone();
      },
      fail: function(response) {
      }
    })
  },

  getFeedTag: function(tag) {
    tag = tag || this.tag;
    var self = this;

    $.ajax({
      url: self.instagramTagUrl(),
      type: "get",
      dataType: "jsonp",
      success: function(response) {
        self.tagData = response.data;
        self.checkIdx++;
        self.checkIfFetchIsDone();
      },
      fail: function(response) {
      }
    })
  },

  instagramTagUrl: function(tag) {
    tag = tag || this.tag;
    return "https://api.instagram.com/v1/tags/" + tag + "/media/recent?count=500&client_id=ac0ee52ebb154199bfabfb15b498c067";
  },

  instagramUserIdUrl: function(username) {
    username = username || this.username;
    return "https://api.instagram.com/v1/users/search?q=" + username + "&client_id=ac0ee52ebb154199bfabfb15b498c067";
  },

  instagramUserFeedUrl: function(userId) {
    userId = this.userId || "767200";
    return "https://api.instagram.com/v1/users/" + userId + "/media/recent/?count=500&client_id=ac0ee52ebb154199bfabfb15b498c067";
  }
};