app.controller('draftController', ['$scope','$firebaseObject','$window','$routeParams',
	function ($scope,$firebaseObject,$window,$routeParams) {
		var ref = new Firebase('https://blazing-torch-1867.firebaseio.com');
		var obj = $firebaseObject(ref);

		$scope.leagueid = $routeParams.leagueid;

		$scope.authData = ref.getAuth();
		$scope.authorized = $scope.authData != null;

		if (!$scope.authorized) {
			$window.location.href = '#/home';
		}

		$scope.sortType = 'pid';
		$scope.sortReverse = false;
		$scope.filters = {
			name : '',
			pos : '',
			gmteam : 'FA',
		};

		$scope.draftstyle = 'snake';
		$scope.draft_started = false;

		$scope.run_draft = function () {}

		$scope.sign_player = function (gmteamid, pid, bonus_yr_option, guaranteed, nonguaranteed) {
			var bonus = null;
			if (bonus_yr_option == 1) bonus = 1;

			ref.child('leagues').child($scope.leagueid).child('contracts').child(gmteamid).child(pid).push({
					bonus_yr_option: bonus,
					guaranteed: guaranteed,
					nonguaranteed: nonguaranteed,
					created: Firebase.ServerValue.TIMESTAMP
			});

			ref.child('leagues').child($scope.leagueid).child('teams').child(gmteamid).child('players').push(pid);

			ref.child('leagues').child($scope.leagueid).child('teams').child(gmteamid).child('name').once('value', function (snapshot) {
				var ind = Object.keys($scope.players_).indexOf(pid);
				$scope.players[ind].gmteam = snapshot.val();
			});
		};

		obj.$loaded().then(function () {
			ref.child('leagues').child($scope.leagueid).child('teams').once('value', function (snapshot) {
				$scope.teams = snapshot.val();
			});

			ref.child('leagues').child($scope.leagueid).child('settings').once('value', function (snapshot) {
				$scope.leaguesettings = snapshot.val();
			});

			var ct = 1;
			for (var key in $scope.teams) {
				$scope.teams[key].draftorder = ct;
				ct = ct + 1;
			}
		
			$scope.players_ = {};
			ref.child('players').on('value', function (snapshot) {
				$scope.players_ = snapshot.val();
				var keys = Object.keys($scope.players_);
				for (var i=0; i<keys.length; i++) {
					var pid = $scope.players_[keys[i]].pid;
					if ($scope.players_[pid].pos != 'DEF') {
						$scope.players_[pid].pfrlink = 'http://www.pro-football-reference.com/players/' + 
											pid.substring(0,1) + '/' + pid + '.htm';
					} else {
						$scope.players_[pid].pfrlink = 'http://www.pro-football-reference.com/teams/' + pid;
					}
					$scope.players_[pid].gmteam = 'FA';
				}
			});

			ref.child('leagues').child($scope.leagueid).child('teams').on('value', function (snapshot) {
				snapshot.forEach(function (childSnapshot) {
					var team = childSnapshot.val();
					if (team.players) {
						for (var i=0; i<team.players.length; i++) {
							var pid = team.players[i];
							$scope.players_[pid].gmteam = team.name;
						}
					}
				});
			});

			$scope.players = [];
			for (var key in $scope.players_) {
				$scope.players.push($scope.players_[key]);
			}
		});
	}
]);