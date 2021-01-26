
import json
import random
from flask import Flask, request
from flask_cors import CORS
from src.board import get_board
from uuid import uuid4
import urllib.parse
import requests
import os


app = Flask(__name__)
CORS(app)
# Load links to the games
game_links_by_season = None
with open('./src/game_links_by_season.json', 'r' ) as js:
    game_links_by_season = json.load(js)

NUM_CATEGORIES = 3

@app.route('/get-board')
def generate_board():
    seasons = list(game_links_by_season.keys())
    season = random.sample(["35", "34", "33", "32", "31", "30"])
    game = random.sample(game_links_by_season[season])
    board = get_board(game)
    return { 'board': board }


@app.route('/api/questions')
def get_questions():
    failure = True
    while failure:
        try:
            resp = get_questions_impl()
            failure = False
            return resp
        except Exception as exc:
            print(exc)
            continue


def get_questions_impl():
    def pick_questions_from_round(jeopardy_round, point_multiplier, num_categories=NUM_CATEGORIES):
        out_questions = []
        board_categories = jeopardy_round
        categories = random.sample(board_categories, num_categories)
        out_categories = []
        for in_category in categories:
            id = str(uuid4())
            category = {
                'title': in_category['title'],
                'details': in_category['comments'],
                'questions': [],
                'round': point_multiplier
            }
            questions = in_category['questions']
            if len(questions) == 5:
                questions = [questions[0], questions[2], questions[4]]
            elif len(questions) == 4:
                questions = [questions[0], questions[2], questions[3]]
                

            for idx, q in enumerate(questions):
                question = {
                    'id': str(uuid4()),
                    'text': q['question'],
                    'answer': q['answer'],
                    'value': point_multiplier * (idx + 1),
                    'category': {
                        'id': id,
                        'title': in_category['title'],
                        'details': in_category['comments'],
                    },
                    'round': point_multiplier
                }
                out_questions.append(question)
        return out_questions

    game = random.choice(game_links_by_season["35"])
    board = get_board(game)
    rounds = board['rounds']
    num_rounds = len(rounds)
    questions = []

    for idx, round in enumerate(rounds):
        questions.extend(pick_questions_from_round(round, idx + 1, num_categories=(6 if num_rounds == 1 else NUM_CATEGORIES)))

    return {'questions': questions, 'game_url': game}

@app.route('/game')
def get_game():
    values = ['200'] # '600', '1000', '400', '1200', '2000']
    num_per_value = 3
    url = 'http://jservice.io/api/categories'
    for value in values:
        params = { 'value': value, 'count': 200
        
         }
        encoded_params = urllib.parse.urlencode(params)
        resp = requests.get(f'{url}?{encoded_params}')
        return {'game': resp.json()}
    
    #return {'game': resp.json()}
if __name__ == '__main__':
     app.run(host='0.0.0.0', port=os.getenv('PORT'))
