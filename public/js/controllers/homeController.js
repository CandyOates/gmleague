app.controller('homeController', ['$scope', '$window', '$firebaseObject',
	function ($scope, $window, $firebaseObject) {
		var ref = new Firebase('http://blazing-torch-1867.firebaseio.com');
		$scope.authData = ref.getAuth();
		$scope.authorized = $scope.authData != null;

		$scope.signin = function () {
			ref.authWithPassword({
			  	"email": $scope.email,
			  	"password": $scope.password
			}, function(error, authdata) {
			  	if (error) {
			    	console.log("Login Failed!", error);
			  	} else {
			    	console.log("Authenticated successfully with payload:", authdata);
			    	$scope.authData = authdata;
			    	$window.location.href = '#/home';
			  	}
			});
		};

		$scope.register = function () {
			ref.createUser({
			  	"email": $scope.email,
			  	"password": $scope.password
			}, function(error, userData) {
			  	if (error) {
			    	switch (error.code) {
			    		case "EMAIL_TAKEN":
				        console.log("The new user account cannot be created because the email is already in use.");
				        break;
			      	case "INVALID_EMAIL":
			        	console.log("The specified email is not a valid email.");
			        	break;
			      	default:
			        	console.log("Error creating user:", error);
			    	}
			  	} else {
			    	console.log("Successfully created user account with uid:", userData.uid);
			    	$window.location.href = '#/home';
			  	}
			});
		};

		if ($scope.authData) {
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
			});
		}
	}
]);
