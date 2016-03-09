var app = angular.module('GMLeagueApp', ['ngRoute', 'firebase']);

var THIS_YEAR = 2015;

app.config(function($routeProvider) {
	$routeProvider.
	when('/home', {
		templateUrl: 'views/home.html',
		controller: 'homeController'
	}).
	when('/newleague', {
		templateUrl: 'views/newLeague.html',
		controller: 'newLeagueController'
	}).
	when('/league/:leagueid', {
		templateUrl: 'views/league.html',
		controller: 'leagueController'
	}).
	when('/league/:leagueid/players', {
		templateUrl: 'views/players.html',
		controller: 'playersController'
	}).
	when('/league/:leagueid/auction', {
		templateUrl: 'views/auction.html',
		controller: 'auctionController'
	}).
	when('/league/:leagueid/team/:teamid', {
		templateUrl: 'views/team.html',
		controller: 'teamController'
	}).
	when('/league/:leagueid/draft', {
		templateUrl: 'views/draft.html',
		controller: 'draftController'
	}).
	otherwise({
		redirectTo: '/home'
	});
});
