var KipptDB = {
	db: null,
	
	init: function() {
		KipptDB.db = openDatabase("kippt", 1.0, "Kippt database cache", 5*1024*1024);
		KipptDB.db.transaction(function(tx) {
			tx.executeSql('CREATE TABLE clips ('
				+ ''
				+ ''
				+ ''
			);
		})
	},

	Account: {
		where: function(params) {
			
		}
	},

	Clips: {

	},

	Users: {

	},

	Lists: {

	},

	Notifications: {

	}
	
}