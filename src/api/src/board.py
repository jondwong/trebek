
import requests
import traceback
import json
import re
from bs4 import BeautifulSoup

clue_response_search = re.compile('<em class="correct_response">(.*)</em>')
final_compiled = re.compile(
    "em class=\\&quot;correct_response\\&quot;&gt;(.+)&lt;\/em&gt;")


def unescape(text):
    clean = text.replace('\\', '').replace('<i>', '').replace('</i>', '').replace("\"", '\'');
    return clean

def generate_round(soup, id):
    board = []
    round = soup.find(id=id)
    categories_soup = round.find_all(class_='category')
    for category in categories_soup:
        ctgy = {}
        ctgy['title'] = unescape(category.find(class_="category_name").text)
        ctgy['comments'] = category.find(class_="category_comments").text
        ctgy['questions'] = []
        board.append(ctgy)

    # round_rows = round.find(class_="round").find_all("tr")[1:]
    # print(round_rows[1:5])
    current_category = None
    for clue in round.select('td.clue'):
        question = None
        try:
            text = None
            id = None
            value = None
            is_daily_double = False
            answer = None

            try:
                clue_info = clue.find(class_='clue_text')
                if not clue_info or clue_info.find('a') is not None:
                    continue
                text = clue_info.text.replace('\\', '')
                text = text.replace('<i>', '').replace('</i>','')
                text = text.replace('<l>','').replace('</l>','')
                id = clue_info.get('id')
            except Exception as exc:
                print("Exception getting clue info: ", clue)
                print(exc)
                raise exc
            id_elements = id.split("_")

            clue_value = clue.find(class_='clue_value')
            if clue_value:
                value = int(clue_value.text[1:].replace(',', ''))
            else:
                value = int(
                    clue.find(class_='clue_value_daily_double').text[5:].replace(',', ''))
                is_daily_double = True
            divs = clue.find_all('div')

            for div in divs:
                if div['onmouseover']:
                    match = clue_response_search.search(div['onmouseover'])
                    if not match:
                        raise Exception("CLUE ANSWER COULD NOT BE FOUND!")
                    answer = unescape(match.groups()[0])

            question = {
                'question': text,
                'id': id,
                'value': value,
                'answer': answer,
                'is_daily_double': is_daily_double
            }

            current_category = int(id_elements[2])-1

        except Exception as exc:
            print("Failed to generate clue from scraped clue = ",
                  clue,  " with exception = ", traceback.format_exc())

        board[current_category]['questions'].append(question)

    return board


def get_final(soup):
    table = soup.find(class_="final_round")
    category_soup = table.find(class_="category_name").text
    divs = table.select("td.category > div")
    answer = None
    for div in divs:
        if div['onmouseover']:
            print(div['onmouseover'])
            match = cl.search(div['onmouseover'])
            print(match)
            if not match:
                raise Exception("CLUE ANSWER COULD NOT BE FOUND!")
            answer = match.groups()[0]

    return {
        'category': category_soup,
        'answer': answer,
        'question': table.find(class_="clue_text").text
    }


def get_board(url):
    URL = url
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, 'html.parser')

    try:
        board = {
            'game_url': url,
            'rounds': {
                'jeopardy': {
                    'board': generate_round(soup, 'jeopardy_round')
                },
                'double_jeopardy': {
                    'board': generate_round(soup, 'double_jeopardy_round')
                },
                #    'final_jeopardy': get_final(soup)
            }
        }
        return board
    except Exception as exc:

        print("Exception getting board for URI:", url,
              ' exception = ', traceback.format_exc())

    return None
