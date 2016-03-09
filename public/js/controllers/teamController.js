app.controller('teamController', ['$scope','$firebaseObject','$window','$routeParams',
	function ($scope, $firebaseObject, $window, $routeParams) {
		var ref = new Firebase('https://blazing-torch-1867.firebaseio.com');
		var obj = $firebaseObject(ref);

		$scope.leagueid = $routeParams.leagueid;
		$scope.teamid = $routeParams.teamid;

		$scope.authData = ref.getAuth();
		$scope.authorized = $scope.authData != null;

		if (!$scope.authorized) {
			$window.location.href = '#/home';
		}

		// $scope.sortType = 'pid';
		// $scope.sortReverse = false;
		// $scope.filters = {
		// 	name : '',
		// 	pos : '',
		// };

		obj.$loaded().then(function () {
			ref.child('leagues').child($scope.leagueid).child('settings').on('value', function (snapshot) {
				$scope.leaguesettings = snapshot.val();
			});

			ref.child('leagues').child($scope.leagueid).child('teams').child($scope.teamid).on('value', function (snapshot) {
				$scope.team = snapshot.val();
			});

			// $scope.playerids = [];
			// ref.child('leagues').child($scope.leagueid).child('teams').child($scope.teamid)
			// 	.child('players').on('value', function (snapshot) {

			// 	snapshot.forEach(function (childSnapshot) {
			// 		var pid = childSnapshot.val();
			// 		$scope.playerids.push(pid);
			// 	});
			// });

			// $scope.players = [];
			// for (var i=0; i<$scope.playerids.length; i++) {
			// 	pid = $scope.playerids[i];
			// 	var player = null;
			// 	ref.child('players').child(pid).once('value', function (snapshot) {
			// 		player = snapshot.val();
			// 		player.pfrlink = 'http://www.pro-football-reference.com/players/' + 
			// 							pid.substring(0,1) + '/' + pid + '.htm';
			// 	});

				// ref.child('leagues').child($scope.leagueid).child('teams').child($scope.teamid)
				// 	.child('contracts').orderBy('gmteam').equalTo($scope.teamid).once('value', 
				// 	function (snapshot) {
				// 		snapshot.forEach(function (childSnapshot) {
				// 			var d = childSnapshot.val();
				// 			if (THIS_YEAR in d.nonguaranteed and termination) {

				// 			}
				// 		});
				// 	}
				// );
			// 	$scope.players.push(player);
			// }
		});
	}
]);