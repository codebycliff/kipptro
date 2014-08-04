(function () {
	"use strict";

	var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
	var ui = WinJS.UI;
	var nav = WinJS.Navigation;
	var utils = WinJS.Utilities;
	var binding = WinJS.Binding;

	ui.Pages.define("/pages/clips/clips.html", {

		ready: function (element, options) {
			var title = WinJS.Utilities.query('.pagetitle')[0];
			title.textContent = options.list.title;
			var listView = element.querySelector("#clips").winControl;
			listView.itemTemplate = element.querySelector(".clipTemplate");
			listView.layout = new ui.ListLayout();
			listView.oniteminvoked = this._itemInvoked.bind(this);
			listView.onselectionchanged = this._selectionChanged.bind(this);
			
			if (Kippt.clipsMeta) {
				Kippt.request2(Kippt.clipsMeta.next).then(function (result) {
					var json = JSON.parse(result.responseText);
					Kippt.clipsMeta = json.meta;
					Kippt.clips = new WinJS.Binding.List(Kippt.clips.slice(0).concat(json.objects));
					listView.itemDataSource = Kippt.clips.itemDataSource;
				});
			}
			else if(options.list) {
				Kippt.getListClips(options.list.id).then(function(response) {
					var json = JSON.parse(response.responseText);
					Kippt.clips = new WinJS.Binding.List(Kippt.clips ? Kippt.clips.slice(0).concat(json.objects) : json.objects);
					Kippt.clipsMeta = json.meta;
					title.textContent = title.textContent + " (" + Kippt.clipsMeta.total_count + ")";
					listView.itemDataSource = Kippt.clips.dataSource;
				});
				
			}
			else {
			Kippt.getListClips('wallpaper-websites').then(function(response) {
					var json = JSON.parse(response.responseText);
					Kippt.clips = new WinJS.Binding.List(Kippt.clips ? Kippt.clips.slice(0).concat(json.objects) : json.objects);
					Kippt.clipsMeta = json.meta;
					title.textContent = title.textContent + " (" + Kippt.clipsMeta.total_count + ")";
					listView.itemDataSource = Kippt.clips.dataSource;
				});
			}
			listView.itemDataSource = Kippt.clips.itemDataSource;
			this._initializeLayout(listView, Windows.UI.ViewManagement.ApplicationView.value);
			listView.element.focus();
			//this._updateVisibility();
			//if (this._isSingleColumn()) {
			//    if (this._itemSelectionIndex >= 0) {
			//        // For single-column detail view, load the article.
			//        binding.processAll(element.querySelector(".articlesection"), this._items.getAt(this._itemSelectionIndex));
			//    }
			//} else {
			//    if (nav.canGoBack && nav.history.backStack[nav.history.backStack.length - 1].location === "/pages/split/split.html") {
			//        // Clean up the backstack to handle a user snapping, navigating
			//        // away, unsnapping, and then returning to this page.
			//        nav.history.backStack.pop();
			//    }
			//    // If this page has a selectionIndex, make that selection
			//    // appear in the ListView.
			//    listView.selection.set(Math.max(this._itemSelectionIndex, 0));
			//}

		},

		// This function updates the page layout in response to viewState changes.
		updateLayout: function (element, viewState, lastViewState) {

			var listView = element.querySelector(".itemslist").winControl;
			if (lastViewState !== viewState) {
				if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
					var handler = function (e) {
						listView.removeEventListener("contentanimating", handler, false);
						e.preventDefault();
					}
					listView.addEventListener("contentanimating", handler, false);
					var firstVisible = listView.indexOfFirstVisible;
					this._initializeLayout(listView, viewState);
					if (firstVisible >= 0 && listView.itemDataSource.list.length > 0) {
						listView.indexOfFirstVisible = firstVisible;
					}
				}

				//var listView = element.querySelector(".itemslist").winControl;
				//var firstVisible = listView.indexOfFirstVisible;
				//this._updateVisibility();

				///// <param name="element" domElement="true" />
				//var handler = function (e) {
				//    listView.removeEventListener("contentanimating", handler, false);
				//    e.preventDefault();
				//}

				//if (this._isSingleColumn()) {
				//    listView.selection.clear();
				//    if (this._itemSelectionIndex >= 0) {
				//        // If the app has snapped into a single-column detail view,
				//        // add the single-column list view to the backstack.
				//        nav.history.current.state = {
				//            groupKey: this._group.key,
				//            selectedIndex: this._itemSelectionIndex
				//        };
				//        nav.history.backStack.push({
				//            location: "/pages/split/split.html",
				//            state: { groupKey: this._group.key }
				//        });
				//        element.querySelector(".articlesection").focus();
				//    } else {
				//        listView.addEventListener("contentanimating", handler, false);
				//        if (firstVisible >= 0 && listView.itemDataSource.list.length > 0) {
				//            listView.indexOfFirstVisible = firstVisible;
				//        }
				//        listView.forceLayout();
				//    }
				//} else {
				//    // If the app has unsnapped into the two-column view, remove any
				//    // splitPage instances that got added to the backstack.
				//    if (nav.canGoBack && nav.history.backStack[nav.history.backStack.length - 1].location === "/pages/split/split.html") {
				//        nav.history.backStack.pop();
				//    }
				//    if (viewState !== lastViewState) {
				//        listView.addEventListener("contentanimating", handler, false);
				//        if (firstVisible >= 0 && listView.itemDataSource.list.length > 0) {
				//            listView.indexOfFirstVisible = firstVisible;
				//        }
				//        listView.forceLayout();
				//    }

				//    listView.selection.set(this._itemSelectionIndex >= 0 ? this._itemSelectionIndex : Math.max(firstVisible, 0));
			}

		},
		_isSingleColumn: function () {
			var viewState = Windows.UI.ViewManagement.ApplicationView.value;
			return (viewState === appViewState.snapped || viewState === appViewState.fullScreenPortrait);
		},

		// This function updates the ListView with new layouts
		_initializeLayout: function (listView, viewState) {
			/// <param name="listView" value="WinJS.UI.ListView.prototype" />

			if (viewState === appViewState.snapped) {
				listView.layout = new ui.ListLayout();
			} else {
				listView.layout = new ui.GridLayout();
			}
		},

		_itemInvoked: function (args) {
			var clip = Kippt.clips.getAt(args.detail.itemIndex).key;
			WinJS.Navigation.navigate("/pages/clip/clip.html", { clip: clip });
		},

		_selectionChanged: function (args) {
			var listView = document.body.querySelector("#clips").winControl;
			var details;
			// By default, the selection is restriced to a single item.
			listView.selection.getItems().done(function updateDetails(items) {
				if (items.length > 0) {
					this._itemSelectionIndex = items[0].index;
					if (this._isSingleColumn()) {
						// If snapped or portrait, navigate to a new page containing the
						// selected item's details.
						nav.navigate("/pages/split/split.html", { groupKey: this._group.key, selectedIndex: this._itemSelectionIndex });
					} else {
						// If fullscreen or filled, update the details column with new data.
						details = document.querySelector(".articlesection");
						binding.processAll(details, items[0].data);
						details.scrollTop = 0;
					}
				}
			}.bind(this));
		},
		_updateVisibility: function () {
			var oldPrimary = document.querySelector(".primarycolumn");
			if (oldPrimary) {
				utils.removeClass(oldPrimary, "primarycolumn");
			}
			if (this._isSingleColumn()) {
				if (this._itemSelectionIndex >= 0) {
					utils.addClass(document.querySelector(".articlesection"), "primarycolumn");
					document.querySelector(".articlesection").focus();
				} else {
					utils.addClass(document.querySelector(".itemlistsection"), "primarycolumn");
					document.querySelector(".itemlist").focus();
				}
			} else {
				document.querySelector("#clips").focus();
			}
		}
	});
})();
