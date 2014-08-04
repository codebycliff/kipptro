// For an introduction to the Split template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=232447
(function () {
	"use strict";

	WinJS.Binding.optimizeBindingReferences = true;

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;
	var nav = WinJS.Navigation;
	var shareOperation = null;
	
	function shareReady(args) {
		if (shareOperation.data.contains(Windows.ApplicationModel.DataTransfer.StandardDataFormats.uri)) {
			shareOperation.data.getUriAsync().done(function (uri) {
				return WinJS.Navigation.navigate('/pages/share/share.html', { link: uri });
			});
		}
	};
	
	app.addEventListener("activated", function (args) {
		if (args.detail.kind === activation.ActivationKind.launch) {
			if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
				// TODO: This application has been newly launched. Initialize
				// your application here.
			} else {
				// TODO: This application has been reactivated from suspension.
				// Restore application state here.
			}

			if (app.sessionState.history) {
				nav.history = app.sessionState.history;
			}
			args.setPromise(WinJS.UI.processAll().then(function () {
				if (nav.location) {
					nav.history.current.initialPlaceholder = true;
					return nav.navigate(nav.location, nav.state);
				} else {
					return nav.navigate(Application.navigator.home);
				}
			}));
		}
		else if (args.detail.kind === activation.ActivationKind.search) {
			args.setPromise(WinJS.UI.processAll().then(function () {
				if (args.detail.queryText === "") {
					WinJS.Navigation.navigate('/pages/lists/lists.html');
					// Navigate to your landing page since the user is pre-scoping to your app.
				} else {
					var q = args.detail.queryText;

					// Display results in UI for eventObject.detail.queryText and eventObject.detail.language.
					// eventObject.detail.language represents user's locale.
				}

				// Navigate to the first scenario since it handles search activation.
				var url = '/pages/search/search.html';
				return WinJS.Navigation.navigate(url, { detail: args.detail });
			}));
		}
		else if (args.detail.kind == activation.ActivationKind.shareTarget) {
			args.setPromise(WinJS.UI.processAll());
			
			shareOperation = args.detail.shareOperation;
			
			WinJS.Application.addEventListener('shareready', shareReady, false);
			WinJS.Application.queueEvent({type: 'shareready'});
			
		}
	});

	Windows.ApplicationModel.Search.SearchPane.getForCurrentView().onquerysubmitted = function (eventObject) {
		WinJS.log && WinJS.log("User submitted the search query: " + eventObject.queryText, "sample", "status");
	};

	app.oncheckpoint = function (args) {
		// TODO: This application is about to be suspended. Save any state
		// that needs to persist across suspensions here. If you need to 
		// complete an asynchronous operation before your application is 
		// suspended, call args.setPromise().
		app.sessionState.history = nav.history;
	};

	app.start();
})();
