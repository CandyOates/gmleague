app.controller('MainController', ['$scope', function($scope) {
	$scope.title = 'GM League Auction';
	$scope.users = [];
	$scope.history = [];
	$scope.years = [1,2,3,4,5,6,7,8,9,10];

	$scope.eps = .05;
	$scope.coef = 1.0;
	$scope.inc = 1.0;
	$scope.price = function(years) {
		var p = Math.pow(1-$scope.eps, years);
		return $scope.coef*(1.0 - p)/$scope.eps;
	};

	$scope.update_bids = function () {
		$scope.bids = []
		for (var i=0; i<$scope.years.length; i++) {
			$scope.bids[i] = {
				years: $scope.years[i],
				price: $scope.price($scope.years[i])
			};
		}
	};

	$scope.update_bids();
	
	$scope.make_bid = function(years, user) {
		var px = $scope.price(years);
		$scope.history.unshift({User:user, Years:years, Price:px, Avg:(px/years)});
		$scope.coef += $scope.inc;
		$scope.update_bids();
	};

	$scope.reset = function() {
		$scope.coef = 1.0;
		$scope.update_bids();
		$scope.history = [];
	};
}]);
