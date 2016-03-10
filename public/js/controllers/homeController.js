app.controller('homeController', ['$scope', '$window', '$firebaseObject',
	function ($scope, $window, $firebaseObject) {
		var ref = new Firebase('http://blazing-torch-1867.firebaseio.com');
		$scope.authData = ref.getAuth();
		$scope.authorized = $scope.authData != null;

		$scope.username_pattern = "[a-zA-Z0-9_]{6,}";
		$scope.password_pattern = "[a-zA-Z_\+\./0-9]{6,}";

		$scope.signout = function () {
			ref.unauth();
			$window.location.reload(true);
		};

		$scope.signin = function () {
			ref.authWithPassword({
			  	"email": $scope.email,
			  	"password": $scope.password
			}, function(error, authdata) {
			  	if (error) {
			    	alert("Login Failed!", error);
			  	} else {
			    	console.log("Authenticated successfully with payload:", authdata.uid);
			    	$window.location.reload(true);
			  	}
			});
		};

		$scope.register = function () {
			var isValid = true;
			for (var i=0; i<$scope.usernames.length; i++) {
				isValid = !($scope.username == $scope.usernames[i]);
				if (!isValid) {
					alert('Username is unavailable');
					return;
				}
			}
			if ($scope.reg_password != $scope.reg_password2) {
				alert('Passwords did not match');
				return;
			}
			ref.createUser({
			  	"email": $scope.reg_email,
			  	"password": $scope.reg_password
			}, function(error, userData) {
			  	if (error) {
			    	switch (error.code) {
			    		case "EMAIL_TAKEN":
				        alert("The new user account cannot be created because the email is already in use.");
				        break;
			      	case "INVALID_EMAIL":
			        	alert("The specified email is not a valid email.");
			        	break;
			      	default:
			        	alert("Error creating user:", error);
			    	}
			  	} else {
			    	console.log("Successfully created user account with uid:", userData.uid);
			    	ref.child('users').child(userData.uid).set({
			    		username: $scope.username,
			    		email: $scope.reg_email
			    	});
			    	$window.location.reload(true);
			  	}
			});
		};

		$scope.accept_league_invite = function (invite) {
			var teams = null;
			ref.child('leagues').child(invite.leagueid).child('teams').once('value', function (snapshot) {
				teams = Object.keys(snapshot.val());
			});
			var fullLeague = false;
			ref.child('leagues').child(invite.leagueid).child('settings/nteams').once('value', function (snapshot) {
				fullLeague = teams.length >= snapshot.val();
			});

			if (fullLeague) {
				alert('Join failed: The league is already full.');
				ref.child('users').child($scope.authData.uid).child('invitations').child(invite.inviteid).remove();
				return;
			}

			ref.child('users').child($scope.authData.uid).child('leagues').push(invite.leagueid);

			var usr = null;
			ref.child('users').child($scope.authData.uid).child('username').once('value', function (snapshot) {
				usr = snapshot.val();
			});

			ref.child('leagues').child(invite.leagueid).child('teams').child($scope.authData.uid).set({
				name: usr,
			});

			ref.child('users').child($scope.authData.uid).child('invitations').child(invite.inviteid).remove();
			getInvitations();
		};

		$scope.reject_league_invite = function (invite) {
			ref.child('users').child($scope.authData.uid).child('invitations').child(invite.inviteid).remove();
			getInvitations();
		}


		if (!$scope.authData) {
			$scope.usernames = [];
			ref.child('users').on('value', function (snapshot) {
				snapshot.forEach(function (childSnapshot) {
					$scope.usernames.push(childSnapshot.val().username);
				});
			});
		}

		var getInvitations = function () {
			ref.child('users').child($scope.authData.uid).child('invitations').orderByChild('timestamp')
				.once('value', function (snapshot) {
					$scope.invites = [];
					snapshot.forEach(function (childSnapshot) {
						var invite = childSnapshot.val();
						invite.inviteid = childSnapshot.key();
						$scope.invites.push(invite);
					});
			});
		}

		if ($scope.authData) {
			console.log($scope.authData);
			$scope.leagues = [];
			var obj = $firebaseObject(ref);

			obj.$loaded().then(function () {
				ref.child('users').child($scope.authData.uid).child('leagues').once('value', function (snapshot) {
					snapshot.forEach(function (childSnapshot) {
						var lid = childSnapshot.val();

						ref.child('leagues').child(lid).once('value', function (snapshot2) {
							var lg = snapshot2.val();
							lg.uid = lid;
							$scope.leagues.push(lg);
						});
					});
				});

				getInvitations();

			});
		}
	}
]);
