(function () {
	"use strict";

	var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
	var ui = WinJS.UI;

	ui.Pages.define("/pages/lists/lists.html", {

		ready: function (element, options) {
			var listView = element.querySelector("#lists").winControl;
			listView.itemTemplate = element.querySelector(".listTemplate");
			listView.groupHeaderTemplate = element.querySelector(".headertemplate");
			listView.oniteminvoked = this._itemInvoked.bind(this);
			//Kippt.request('lists', {}, function(response) {
			//    var json = JSON.parse(response.responseText);
			//    Kippt.lists = new WinJS.Binding.List(json.objects);
			//    listView.itemDataSource = Kippt.lists.dataSource;
			//});
			Kippt.allLists().then(function (result) {
				var json = JSON.parse(result.responseText);
				Kippt.lists = new WinJS.Binding.List(Kippt.lists.slice(0).concat(json.objects));
				Kippt.listsMeta = json.meta;
				listView.itemDataSource = Kippt.lists.dataSource;
			});
			this._initializeLayout(listView, Windows.UI.ViewManagement.ApplicationView.value);
			listView.element.focus();
		},

		// This function updates the page layout in response to viewState changes.
		updateLayout: function (element, viewState, lastViewState) {
			/// <param name="element" domElement="true" />

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
			}
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
			var list = Kippt.lists.getAt(args.detail.itemIndex);
			WinJS.Navigation.navigate("/pages/clips/clips.html", { list: list });
		}
	});
})();
