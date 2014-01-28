function InstagramQuery(username, tag, limit, success) {
  this._checkIdx = 0;
  this._limit = limit || 50;
  this._userData = [];
  this._tagData = [];
  this._userId;
  this._username = username || "mttlmy";
  this._tag = tag || "honeysmoon";
  this._hasData = false;
  this._success = success;
  this._postsFilteredByTag = [];

  this.fetchData();
}

InstagramQuery.prototype = {
  fetchData: function() {
    this.getUserFeed();
    this.getTagFeed(this.instagramTagUrl());
  },

  checkIfFetchIsDone: function() {
    if (this._checkIdx < 3) {
      return;
    }

    this._hasData = true;
    this.filterPostsByTag();
  },

  filterPostsByTag: function() {
    var self = this;

    if (this._postsFilteredByTag.length) {
      return this._postsFilteredByTag;
    }

    // filter user posts by tag == this._tag
    var filteredUserData = _.filter(this._userData, function(post) {
      return _.contains(post.tags, self._tag);
    });

    // filter tag posts by user_id = this._userId
    var filteredTagData = _.filter(this._tagData, function(post) {
      return post.user.id == self._userId;
    });

    var result = filteredUserData;

    for (var i = 0; i < filteredTagData.length; i++) {
      var match = false;
      var tagId = filteredTagData[i].id;
      for (var j = 0; j < filteredUserData.length; j++) {
        if (filteredUserData[j].id == tagId) {
           match = true;
           break;
        }
      }
      if (!match) {
        result.push(filteredTagData[i]);
      }
    }

    this._postsFilteredByTag = result;

    this._userData = [];
    this._tagData = [];

    if (this._success)
      this._success(this);
  },

  getUserFeed: function() {
    var self = this;
    var success = function(url) { self.getFeedForUser(url) };
    this.getUserId(success);
  },

  getUserId: function(success) {
    var self = this;
    username = this._username;
    $.ajax({
      url: self.instagramUserIdUrl(),
      type: "get",
      dataType: "jsonp",
      success: function(response) {
        var data = response.data;
        if (data.length > 0) {
          var user = data[0];
          var id = user.id;
          self._checkIdx++;
          self._userId = id;
          if (success) {
            success(self.instagramUserFeedUrl());
          }
        } else {
          alert ("No user found.");
        }

      },
      fail: function(response) {
      }
    })
  },

  getFeedForUser: function(url) {
    var self = this;
    $.ajax({
      url: url,
      type: "get",
      dataType: "jsonp",
      success: function(response) {
        self._userData = self._userData.concat(response.data);
        if (response.pagination.next_url && self._userData.length < self._limit) {
          self.getFeedForUser(response.pagination.next_url)
        } else {
          self._checkIdx++;
          self.checkIfFetchIsDone();
        }
      },
      fail: function(response) {
      }
    })
  },

  getTagFeed: function(url) {
    var self = this;

    $.ajax({
      url: url,
      type: "get",
      dataType: "jsonp",
      success: function(response) {
        self._tagData = self._tagData.concat(response.data);
        if (response.pagination.next_url && self._tagData.length < self._limit) {
          self.getTagFeed(response.pagination.next_url);
        } else {
          self._checkIdx++;
          self.checkIfFetchIsDone();
        }
      },
      fail: function(response) {
      }
    })
  },

  // unused
  extractTagsFromCommentsInPost: function(post) {
    var comments = post.comments.data;
    var tags = [];
    for (var i = 0; i < comments.length; i++) {
      var t = comments[i].text.match(/#\w+/g);
      if (t && t.length) {
        var a = _.map(t, function(r) { return r.replace('#', ''); });
        tags = tags.concat(a);
      }
    }

    return this.sanitizeArr(tags);
  },

  sanitizeArr: function(arr) {
    return _.filter(arr, function(a) { return a !== null; });
  },

  instagramTagUrl: function() {
    return "https://api.instagram.com/v1/tags/" + this._tag + "/media/recent?count=" + this._limit + "&client_id=ac0ee52ebb154199bfabfb15b498c067";
  },

  instagramUserIdUrl: function() {
    return "https://api.instagram.com/v1/users/search?q=" + this._username + "&client_id=ac0ee52ebb154199bfabfb15b498c067";
  },

  instagramUserFeedUrl: function() {
    return "https://api.instagram.com/v1/users/" + this._userId + "/media/recent/?count=" + this._limit + "&client_id=ac0ee52ebb154199bfabfb15b498c067";
  }
};
