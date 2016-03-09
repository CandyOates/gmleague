app.controller('leagueController', ['$scope', '$firebaseObject', '$window', '$routeParams',
	function ($scope, $firebaseObject, $window, $routeParams) {
		var ref = new Firebase('https://blazing-torch-1867.firebaseio.com');
		var obj = $firebaseObject(ref);

		$scope.leagueid = $routeParams.leagueid;

		$scope.authData = ref.getAuth();
		$scope.authorized = $scope.authData != null;

		if (!$scope.authorized) {
			$window.location.href = '#/home';
		}

		obj.$loaded().then(function () {
			ref.child('leagues').child($scope.leagueid).child('teams').on('value', function (snapshot) {
				$scope.teams = [];
				snapshot.forEach(function (childSnapshot) {
					var team = childSnapshot.val();
					team.userid = childSnapshot.key();
					$scope.teams.push(team);
				});
			});

			ref.child('leagues').child($scope.leagueid).child('settings').on('value', function (snapshot) {
				$scope.leaguesettings = snapshot.val();
			});
		});
	}
]);