# gmleague

scripts/
	get_players.py:
		writes a json file containing a list of dictionaries (aka json objects) for each NFL player who's played sufficiently recently using pro-football-reference.com as a source

data/
	players2015.json:
		output of get_players.py: contains all players who have played since 2014

Used command $firebase data:set /players data/players2015.json to upload player list to firebase
