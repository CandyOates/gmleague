app.controller('newLeagueController', ['$scope', '$window',
	function ($scope, $window) {
		var ref = new Firebase('https://blazing-torch-1867.firebaseio.com');

		$scope.authData = ref.getAuth();
		$scope.authorized = $scope.authData != null;

		if (!$scope.authorized) {
			$window.location.href = '#/home';
		}

		$scope.lgname = '';
		$scope.nteams = 10;

		$scope.submit = function () {
			var settings = {
				name: $scope.lgname,
				nteams: $scope.nteams,
			};
			var teams = {};

			teams[$scope.authData.uid] = {
				name : '',
			};

			var league = {
				settings: settings,
				teams: teams,
			}
			var lid = ref.child('leagues').push(league).path.w[1];

			ref.child('users').child($scope.authData.uid).child('leagues').push(lid);

			$window.location.href = '#/home';
		};
	}
]);