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

		$scope.email = '';
		$scope.message = 'Please join my league.';

		$scope.sendinvite = function () {			
			ref.child('users').once('value', function (snapshot) {
				$scope.validEmail = false;
				snapshot.forEach(function (childSnapshot) {
					var bool = childSnapshot.val().email == $scope.email;
					$scope.validEmail = $scope.validEmail || (bool);
					if (bool) {
						$scope.invited_uid = childSnapshot.key();
					}
				})
			});

			if (!$scope.validEmail) {
				alert('Provided email is not registered.');
				return;
			}

			var inLeague = false;
			ref.child('users').child($scope.invited_uid).child('leagues').once('value', function (snapshot) {
				snapshot.forEach(function (childSnapshot) {
					var lid = childSnapshot.val();
					inLeague = inLeague || (lid == $scope.leagueid);
				});
			});

			if (inLeague) {
				alert('That user is already in the league.');
				return;
			}

			var sender = '';
			ref.child('users').child($scope.authData.uid).child('username').once('value', function (snapshot) {
				sender = snapshot.val();
			});
			ref.child('users').child($scope.invited_uid).child('invitations').push({
				lgname: $scope.leaguesettings.name,
				leagueid: $scope.leagueid,
				senderid: $scope.authData.uid,
				sender: sender,
				message: $scope.message,
				timestamp: Firebase.ServerValue.TIMESTAMP,
			})
		};

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