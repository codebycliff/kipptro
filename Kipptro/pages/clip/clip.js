(function () {
	"use strict";

	var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
	var ui = WinJS.UI;

	ui.Pages.define("/pages/clip/clip.html", {

		ready: function (element, options) {
			var clip = options.clip;
			var title = WinJS.Utilities.query('.pagetitle')[0];
			title.textContent = clip.title;
			var iframe = element.querySelector("#browser");
			iframe.src = clip.url;

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
			var groupKey = Data.groups.getAt(args.detail.itemIndex).key;
			WinJS.Navigation.navigate("/pages/split/split.html", { groupKey: groupKey });
		}
	});
})();
