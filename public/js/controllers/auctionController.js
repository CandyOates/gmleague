app.controller('auctionController', ['$scope','$firebaseObject','$window','$routeParams',
	function ($scope, $firebaseObject, $window, $routeParams) {
		var ref = new Firebase('https://blazing-torch-1867.firebaseio.com');
		var obj = $firebaseObject(ref);

		$scope.leagueid = $routeParams.leagueid;

		$scope.authData = ref.getAuth();
		$scope.authorized = $scope.authData != null;

		if (!$scope.authorized) {
			$window.location.href = '#/home';
		}

		$scope.sign_player = function (gmteamid, pid, bonus_yr_option, guaranteed, nonguaranteed) {
			var bonus = null;
			if (bonus_yr_option == 1) bonus = 1;

			ref.child('leagues').child($scope.leagueid).child('contracts').child(gmteamid).child(pid).push({
					bonus_yr_option: bonus,
					guaranteed: guaranteed,
					nonguaranteed: nonguaranteed,
					created: Firebase.ServerValues.TIMESTAMP
			});

			// We won't want this moving forward
			ref.child('leagues').child($scope.leagueid).child('teams').child(gmteamid).child('players').push(pid);
		};

	}
]);