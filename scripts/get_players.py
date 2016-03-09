import re
import urllib2
import argparse
import bs4
import json

if __name__ == '__main__':
	parser = argparse.ArgumentParser()

	parser.add_argument('start_year', type=int, help='Only take players who have played as recently as this year.')
	parser.add_argument('this_year', type=int, help='The current season year.')
	parser.add_argument('outfile', type=str, help='Write json list to this file.')

	args = parser.parse_args()

	BASE_URL = 'http://www.pro-football-reference.com/players/%s/'

	START_YEAR = args.start_year
	POSITIONS = ('QB','RB','WR','TE','K','DEF')
	THIS_YEAR = args.this_year

	players = []
	for n in range(65,65+26):
		c = chr(n)
		url = BASE_URL % c
		page = urllib2.urlopen(url)
		text = page.read()
		matches = filter(lambda x: x is not None, map(lambda x: re.search(r'^(<b>){0,1}<a href="/players/./(.+)\.htm">([a-zA-Z ]+)</a> +([A-Z-]+) +(\d\d\d\d)-(\d\d\d\d)(</b>){0,1}$', x), text.split('\n')))
		rows = map(lambda x: x.groups()[1:4] + (int(x.groups()[4]),) + (int(x.groups()[5]),), matches)
		current = filter(lambda x: x[4] >= START_YEAR and any([pos in x[2] for pos in POSITIONS]), rows)
		players.extend(current)

	TEAM_URL = 'http://www.pro-football-reference.com/teams/%s'
	url = TEAM_URL % ''
	page = urllib2.urlopen(url)
	text = page.read()
	soup = bs4.BeautifulSoup(text, 'lxml')

	text = soup.find('table', attrs={'id': 'teams_active'}).__str__()
	matches = filter(lambda x: x is not None, map(lambda x: re.search(r'^<td align="left"><a href="/teams/([a-zA-Z]+)/">(.+)</a>', x), text.split('\n')))

	for match in matches:
	    players.append(match.groups() + ('DEF', 0, THIS_YEAR))
	
	data = map(lambda x: dict(zip(['pid','name','pos','start_year','last_year'], x)), players)
	pids = map(lambda x: x['pid'], data)
	data = dict(zip(pids, data))
	
	with open(args.outfile, 'w') as w:
		json.dump(data, w)
