(function () {
	"use strict";
	WinJS.Namespace.define('Kippt', {
		lists: new WinJS.Binding.List([]),
		listsMeta: null,
		clipsMeta: null,
		clips: new WinJS.Binding.List([]),
		apiUrl: 'https://kippt.com/api/',
		url: 'https://kippt.com',
		username: 'codebycliff',
		apiToken: 'a0802ceed44283902f4115d7323fa43d77441ffb',
		request: function (command, data, callback) {
			return WinJS.xhr({
				url: Kippt.apiUrl + command,
				type: 'get',
				data: data,
				headers: {
					"X-Kippt-Username": Kippt.username,
					"X-Kippt-API-Token": Kippt.apiToken
				}
			}).then(callback);
			// }).then(function(response) {
			//     callback(JSON.parse(response.responseText));
			// });
		},
		request2: function (path, data, method, headers) {
			return WinJS.xhr({
				url: Kippt.url + path,
				type: method ? method : 'get',
				data: data ? data : {},
				headers: {
					"X-Kippt-Username": Kippt.username,
					"X-Kippt-API-Token": Kippt.apiToken
				}
			});
		},
		//GET /api/account/
		account: function (includeData) {
			var url = Kippt.apiUrl + 'account/';
			if (includeData && typeof includeData == 'boolean') url += '?include_data=api_token';
		},
		// GET /api/users/:user_id/
		getUser: function (userId) {
			var url = Kippt.apiUrl + 'users/' + (userId ? userId : 'self');
		},
		// GET /api/users/:user_id/followers/
		userFollowers: function (userId) { },
		// GET /api/users/:user_id/following/
		userFollowing: function (userId) { },
		// GET /api/users/:user_id/relationship/  | no 'self'
		userRelationship: function (userId) { },
		// GET /api/users/:user_id/clips/
		userClips: function (userId, list, via) {
			var params = '?include_data=' + (list ? 'list' : '');
			params += (via ? ',via' : '');
		},
		// GET /api/users/:user_id/clips/favorites/
		userFavoriteClips: function (userId, list, via) { },
		// GET /api/users/:user_id/clips/likes/
		userLikedClips: function (userId, list, via) { },
		// GET /api/users/:user_id/lists/
		userLists: function (userId) { },
		// GET /api/users/:user_id/lists/:list_id/  | id or slug
		userList: function (userId) { },
		// GET /api/users/search/
		searchUsers: function (criteria) { },
		// POST /api/users/:user_id/relationship/ | no 'self'
		postUserRelationship: function (userId, action) {
			var data = { "action": action };
		},
		followUser: function (userId) { Kippt.Users.postRelationship(userId, 'follow'); },
		unfollowUser: function (userId) { Kippt.Users.postRelationship(userId, 'unfollow'); },

		// GET /api/clips/
		allClips: function (includList, includeVia, includeMedia, since, url) {
			return Kippt.request2('/api/clips?include_data=list,media');
		},
		// GET /api/clips/feed/
		getClipsFeed: function (includeList, includeVia, includeMedia) { },
		// GET /api/clips/favorites/
		getClipsFavorite: function (includList, includeVia, includeMedia, since, url) { },
		// GET /api/clips/:clip_id/
		getClip: function (clipId, includList, includeVia, includeMedia) { },
		// GET /api/clips/:clip_id/comments/
		getClipComments: function (clipId) { },
		// GET /api/clips/:clip_id/likes/
		getClipLikes: function (clipId) { },
		// GET /api/clips/search/
		searchClips: function (q, includeList, includeVia, includeMedia) {
			return Kippt.request2('/api/clips/search?q=' + encodeURIComponent(q) + '&limit=200');
		},
		// PUT /api/clips/:clip_id/
		putClip: function (clipId, data) { },
		// POST /api/clips/
		postCilp: function (data) { },
		// POST /api/clips/:clip_id/comments/
		postClipComment: function (cilpId, data) { },
		// POST /api/clips/:clip_id/likes/
		postClipLike: function (clipId) { },
		// POST /api/clips/:clip_id/favorite/
		postClipFavorite: function (clipId) { },
		// DELETE /api/clips/:clip_id/
		deleteClip: function (clipId) { },
		// DELETE /api/clips/:clip_id/comments/:comment_id/
		deleteClipComment: function (clipId, commentId) { },
		// DELETE /api/clips/:clip_id/favorite/
		deleteClipFavorite: function (clipId) { },
		// DELETE /api/clips/:clip_id/likes/
		deleteClipLike: function (clipId) { },
		// GET /api/lists/
		allLists: function () {
			return Kippt.request2('/api/lists?limit=200');
		},
		//? GET /api/lists/following/
		getListsFollowing: function () { },
		// GET /api/lists/:list_id/
		getList: function (listId) { },
		// GET /api/lists/:list_id/clips/
		getListClips: function (listId, includeList, includeVia, since, url) {
			return Kippt.request2('/api/lists/' + listId + '/clips/?include_data=list,media&limit=200');
		},
		// GET /api/lists/:list_id/relationship/
		getListRelationship: function (listId) { },
		//? GET /api/lists/search/
		searchLists: function (criteria) { },
		// PUT /api/lists/:list_id/
		putList: function (listId, data) { },
		// POST /api/lists/
		postList: function (data) { },
		// POST /api/lists/:list_id/relationship/
		postListRelationship: function (listId, action) {
			var data = { "action": action };
		},
		followList: function (listId) { Kippt.Lists.postRelationship(listId, 'follow'); },
		unfollowList: function (listId) { Kippt.Lists.postRelationship(listId, 'unfollow'); },
		// DELETE /api/lists/:list_id/
		deleteList: function (listId) { },
		// GET /api/notifications/
		getNotifications: function (includeClip, includeList, since) {
			var params = '?include_data=' + includeClip + "," + includeList;

		},
		// POST /api/notifications/
		markNotificationSeen: function () {
			var data = { "action": "mark_seen" };
		}
	});

})();

//function Result() {
//	this.meta = {
//		"limit": 20,
//		"next": "/api/clips/?limit=20&offset=20",
//		"offset": 0,
//		"previous": null,
//		"total_count": 33
//	};
//	this.objects = []
//}
//
//$data.Entity.extend("Meta", {
//	limit: { type: "int" },
//	offset: { type: "int" },
//	total_count: { type: "int" },
//	next: { type: "string" },
//	previous: { type: "string" }
//});
//
//$data.Entity.extend("UserCounts", {
//	follows: {type: "int"},
//	followed_by: {type: "int"}
//});
//
//$data.Entity.extend("User", {
//	id: { type: "int", key: true, computed: false },
//	resource_uri: {type: "string"},
//	username: { type: "string" },
//	full_name: {type: "string"},
//	bio: { type: "string" },
//	is_pro: { type: "bool" },
//	app_url: { type: "string" },
//	website_url: {type: "string"},
//	avatar_url: {type: "string"},
//	twitter: { type: "string" },
//	github: { type: "string" },
//	dribbble: "jorilallo",
//	counts: { type: UserCounts }
//});
//
//var Clip = {
//	via: null,
//	saves: {
//		count: 0,
//		data: []
//	},
//	favicon_url: "https://www.google.com/s2/u/0/favicons?domain=www.romainbrasier.fr",
//	is_favorite: false,
//	likes: {
//		count: 0,
//		data: []
//	},
//	id: 10654195,
//	app_url: "/jorilallo/awesome/clips/10654195",
//	title: "404 Lemmings page",
//	media: {
//		title: "Développeur Web sur Lille (59), Romain Brasier.",
//		description: "Développeur Web sur Lille (59), Site personnel de Romain Brasier.",
//		provider: {
//			url: "https://kippt.com",
//			name: "Kippt"
//		},
//		images: {
//			tile: {
//				url: "https://d19weqihs4yh5u.cloudfront.net/links/835babda8910f453807cc944f62829f3547ab928/350x200",
//				width: 350,
//				height: 200
//			},
//			original: {
//				url: "https://d19weqihs4yh5u.cloudfront.net/links/835babda8910f453807cc944f62829f3547ab928/original",
//				width: 50,
//				height: 33
//			}
//		},
//		article: {
//			html: "PGRpdj4KCQk8ZGl2PgoJCQkJCTxhIGhyZWY9Imh0dHA6Ly93d3cucm9tYWluYnJhc2llci5mci80MDQiPjxpbWcgc3JjPSJodHRwOi8vd3d3LnJvbWFpbmJyYXNpZXIuZnIvaW1hZ2VzL3A0MDQvZnIuanBnIj48L2E+CgkJCQkKCQk8L2Rpdj4KCQkKCQkKCQk8ZGl2PgoJCQkJCQkJPHA+CgkJCQkJVGhpcyBwYWdlIGlzIG5vIGxvbmdlciBvZiB0aGlzIHdvcmxkLjxicj4KCQkJCQlTdGF5IG9uIHRoaXMgbGFzdCByZXN1bHQgaW4gdGhlIHNhY3JpZmljZSBvZiA8Yj40MDQ8L2I+IExlbW1pbmdzLjxicj4KCQkJCQlVbmxlc3MgeW91IGRlY2lkZSB0byBzYXZlIHRoZW0gYWxsITxicj48c3Bhbj5Ib3ZlciBvdmVyIHRoZW0gdG8gYnJpbmcgYSBwYXJhY2h1dGUuPC9zcGFuPgoJCQkJPC9wPgoJCQkJCQoJCTwvZGl2PgoJCQoJCTxkaXY+CgkJCQkJCQk8cD4KCQkJCQk8YSBocmVmPSJodHRwOi8vd3d3LnJvbWFpbmJyYXNpZXIuZnIvIj5SZXR1cm4gdG8gc2l0ZTxicj48c3Bhbj4oQW5kIGxldCB0aGVtIGRpZSBwb29yIGxlbW1pbmdzKTwvc3Bhbj48L2E+CgkJCQk8L3A+CgkJCQkJCgkJPC9kaXY+CgkJCgkJCgkJCiAgICA8L2Rpdj4=",
//			author_url: null,
//			author: null
//		},
//		type: "article"
//	},
//	comments: {
//		count: 2,
//		data: [
//            {
//            	body: "You got to love Lemmings. And save them.",
//            	user: {
//            		username: "jorilallo",
//            		bio: "Co-founder of Kippt. I love building products.",
//            		app_url: "/jorilallo",
//            		twitter: "jorilallo",
//            		counts: {
//            			follows: 1060,
//            			followed_by: 20452
//            		},
//            		github: "jorde",
//            		avatar_url: "http://kippt-image-vault.herokuapp.com/vaults/avatars/images/147d86b9-0830-49d8-a449-0421a6a4bf05/sizes/160x160",
//            		is_pro: true,
//            		full_name: "Jori Lallo",
//            		dribbble: "jorilallo",
//            		id: 1,
//            		website_url: "http://about.me/jorilallo",
//            		resource_uri: "/api/users/1/"
//            	},
//            	resource_uri: "/api/clips/10654195/comments/8006/",
//            	id: 8006,
//            	created: 1361535067
//            },
//            {
//            	body: "All those poor Lemmings!",
//            	user: {
//            		username: "niklausgerber",
//            		bio: "New media conceptor, problem solver & digital architect seeking to make the complex clear & beautiful.",
//            		app_url: "/niklausgerber",
//            		twitter: "niklausgerber",
//            		counts: {
//            			follows: 21,
//            			followed_by: 4
//            		},
//            		github: "niklausgerber",
//            		avatar_url: "http://kippt-image-vault.herokuapp.com/vaults/avatars/images/09ed9863-7b7b-4a6e-9cab-a2262f377993/sizes/160x160",
//            		is_pro: false,
//            		full_name: null,
//            		dribbble: "niklausgerber",
//            		id: 46793,
//            		website_url: "http://niklausgerber.com/",
//            		resource_uri: "/api/users/46793/"
//            	},
//            	resource_uri: "/api/clips/10654195/comments/6955/",
//            	id: 6955,
//            	created: 1359008573
//            }
//		]
//	},
//	type: "link",
//	updated: 1360890944,
//	user: {
//		username: "jorilallo",
//		bio: "Co-founder of Kippt. I love building products.",
//		app_url: "/jorilallo",
//		twitter: "jorilallo",
//		counts: {
//			follows: 1060,
//			followed_by: 20452
//		},
//		github: "jorde",
//		avatar_url: "http://kippt-image-vault.herokuapp.com/vaults/avatars/images/147d86b9-0830-49d8-a449-0421a6a4bf05/sizes/160x160",
//		is_pro: true,
//		full_name: "Jori Lallo",
//		dribbble: "jorilallo",
//		id: 1,
//		website_url: "http://about.me/jorilallo",
//		resource_uri: "/api/users/1/"
//	},
//	url_domain: "www.romainbrasier.fr",
//	created: 1358983868,
//	url: "http://www.romainbrasier.fr/404.php?lang=en",
//	notes: "Awesome 404 page",
//	list: "/api/lists/13/",
//	resource_uri: "/api/clips/10654195/"
//};
//
//var List = {
//	app_url: "/jorilallo/awesome",
//	rss_url: "https://kippt.com/jorilallo/awesome/feed",
//	updated: 1361170954,
//	description: "My collection of random awesome links I find on the Interwebs",
//	title: "Awesome",
//	created: 1315942545,
//	collaborators: {
//		count: 0,
//		data: []
//	},
//	slug: "awesome",
//	user: {
//		username: "jorilallo",
//		bio: "Co-founder of Kippt. I love building products.",
//		app_url: "/jorilallo",
//		twitter: "jorilallo",
//		counts: {
//			follows: 1060,
//			followed_by: 20455
//		},
//		github: "jorde",
//		avatar_url: "http://kippt-image-vault.herokuapp.com/vaults/avatars/images/147d86b9-0830-49d8-a449-0421a6a4bf05/sizes/160x160",
//		is_pro: true,
//		full_name: "Jori Lallo",
//		dribbble: "jorilallo",
//		id: 1,
//		website_url: "http://about.me/jorilallo",
//		resource_uri: "/api/users/1/"
//	},
//	id: 13,
//	is_private: false,
//	resource_uri: "/api/lists/13/"
//};
//
//var Comment = {
//	id: 8006,
//	body: "You got to love Lemmings. And save them.",
//	user: {
//		username: "jorilallo",
//		bio: "Co-founder of Kippt. I love building products.",
//		app_url: "/jorilallo",
//		avatar_url: "http://kippt-image-vault.herokuapp.com/vaults/avatars/images/147d86b9-0830-49d8-a449-0421a6a4bf05/sizes/160x160",
//		twitter: "jorilallo",
//		id: 1,
//		github: "jorde",
//		website_url: "http://about.me/jorilallo",
//		full_name: "Jori Lallo",
//		dribbble: "jorilallo",
//		counts: {
//			follows: 1060,
//			followed_by: 20452
//		},
//		is_pro: true,
//		resource_uri: "/api/users/1/"
//	},
//	created: 1361535067,
//	resource_uri: "/api/clips/10654195/comments/8006/"
//};
//
//var Notification = {
//	item_url: "/jkan",
//	created: 1361414461,
//	is_seen: true,
//	user: {
//		username: "jkan",
//		bio: null,
//		app_url: "/jkan",
//		avatar_url: "https://d17f28g3dsa4vh.cloudfront.net/img/default-avatar.png",
//		twitter: null,
//		id: 50846,
//		github: null,
//		website_url: null,
//		full_name: null,
//		dribbble: null,
//		counts: {
//			follows: 83,
//			followed_by: 4
//		},
//		is_pro: false,
//		resource_uri: "/api/users/50846/"
//	},
//	type: "follow",
//	id: 82889,
//	resource_uri: "/api/notifications/82889/"
//};
