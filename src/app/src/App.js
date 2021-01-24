import logo from './logo.svg';
import './App.css';
import React, { Component,useState, useEffect } from 'react'
import ls from 'local-storage';
import Button from './components/buttons/Button'
import TeamButton from './components/buttons/TeamButton'
import Question from './components/Question';
import ReactLoading from 'react-loading'
import Scoreboard from './components/scoring/Scoreboard'
;
import {FaPlus, FaRegSave} from 'react-icons/fa';
import GameOver from './GameOver';
const TREBEK_LS_KEY = 'trebek-game'
const CATEGORY_COLORS = [
  '#e76f51',
  '#f4a261',
  '#e9c46a',
  '#2a9d8f',
  '#264653',
  '#7b1e7a',
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      current_team: null,
      curr_question_idx: 0,
      display_answer: false,
      teams: [],
      team_colors: {},
      team_answers: {},
      team_answered_questions: {},
      correct_responses: [],
      team_points: {},
      question_results: [],
      loading: true,
      game_ended: false,
      source_url: '',
    };
  }

  componentDidMount() {
    let game = ls.get(TREBEK_LS_KEY);
    if(!game) {
      this._start_new_game();
    } 
    else {
      console.log('setting from game');
      this.setState(
        JSON.parse(game)
      );
    }
  }

  _start_new_game() {
    this.setState({loading: true});
    fetch('/questions')
      .then((res) => res.json())
      .then((data) => {
        let q = data.questions;
        let idx = 0;
        let category_colors = {};

        q.forEach((question) => {
          if (!category_colors[question.category.id]) {
            category_colors[question.category.id] = CATEGORY_COLORS[idx];
            ++idx;
          }
          question.category.color = category_colors[question.category.id];
        });

        // init teams
        this.setState({
          questions: q,
          current_team: 'A',
          teams: ['A', 'B'],
          team_colors: {
            A: '#6699CC',
            B: '#4c7226',
          },
          team_points: {
            A: 0,
            B: 0,
          },
          correct_responses: [],
          team_answered_questions: {
            A: {},
            B: {},
          },
          loading: false,
          source_url: data.game_url,
        });
      });
  }

  _save_game() {
    ls.set(TREBEK_LS_KEY, JSON.stringify(this.state));
  }

  _move_to_next_question() {
    let current_team = this.state.current_team;
    let teams = this.state.teams;
    let curr_idx = teams.indexOf(current_team);

    if (curr_idx == teams.length - 1) {
      current_team = teams[0];
    } else {
      current_team = teams[curr_idx + 1];
    }

    let curr_q_idx = this.state.curr_question_idx;

    if (curr_q_idx + 1 < this.state.questions.length) {
      this.setState({
        curr_question_idx: this.state.curr_question_idx + 1,
        display_answer: false,
        current_team: current_team,
      });
    } else {
      ls.remove(TREBEK_LS_KEY)
      this.setState({
        game_ended: true,
      });
    }
  }

  _modify_score(team_id, value_modifier) {
    let q = this.state.questions[this.state.curr_question_idx];
    let team_points = Object.assign({}, this.state.team_points);
    let team_answered_questions = Object.assign(
      {},
      this.state.team_answered_questions
    );
    if (!team_answered_questions[q.id]) {
      team_answered_questions[q.id] = {};
    }

    let modifier_text = value_modifier > 0 ? '+' : '-';

    team_answered_questions[q.id][team_id] = `${modifier_text}${q.value}`;

    team_points[team_id] += q.value * value_modifier;

    this.setState({
      team_points,
      team_answered_questions,
    });
  }

  _change_team_turn() {
    let current_team = this.state.current_team;
    let teams = this.state.teams;
    let curr_idx = teams.indexOf(current_team);

    if (curr_idx == teams.length - 1) {
      current_team = teams[0];
    } else {
      current_team = teams[curr_idx + 1];
    }

    this.setState({current_team: current_team});
  }

  _scoreboard_cell_clicked(question_id, question_idx) {
    this.setState({
      curr_question_idx: question_idx,
    });
  }
  render() {
    let team_buttons = this.state.teams.map(
      function (team_id) {
        let q = this.state.questions[this.state.curr_question_idx];
        return (
          <TeamButton
            team_id={team_id}
            sensitive={
              !this.state.team_answered_questions[q.id] ||
              !this.state.team_answered_questions[q.id][team_id]
            }
            color={this.state.team_colors[team_id]}
            onIncrement={this._modify_score.bind(this, team_id, 1)}
            onDecrement={this._modify_score.bind(this, team_id, -1)}
          />
        );
      }.bind(this)
    );

    return (
      <div className="App">
        <TopNavigation 
          onNewGameClick={this._start_new_game.bind(this)}
          onSaveClick={this._save_game.bind(this)}  
          />
        {!this.state.loading && this.state.game_ended && (
          <GameOver team_points={this.state.team_points} />
        )}
        {this.state.loading && <ReactLoading />}
        {!this.state.loading && !this.state.game_ended && (
          <div className="AppContainer">
            <TurnIndicator
              team={this.state.current_team}
              color={this.state.team_colors[this.state.current_team]}
              onClick={this._change_team_turn.bind(this)}
            />
            <div className="QuestionContainer">
              {this.state.questions.length > 0 && (
                <Question
                  onAnswerClick={function () {
                    this.setState({display_answer: true});
                  }.bind(this)}
                  displayAnswer={this.state.display_answer}
                  question={this.state.questions[this.state.curr_question_idx]}
                />
              )}
            </div>
            <div className="BottomNavigation">
              <Button
                onClick={this._move_to_next_question.bind(this)}
                text="next"
                color="rgb(65, 71, 82)"
              ></Button>
              <div className="BottomNavigation-spacer" />
              {team_buttons}
            </div>
            {
              <Scoreboard
                team_answered_questions={this.state.team_answered_questions}
                questions={this.state.questions}
                team_points={this.state.team_points}
                team_colors={this.state.team_colors}
                current_question_index={this.state.curr_question_idx}
                onCellClick={this._scoreboard_cell_clicked.bind(this)}
              />
            }
          </div>
        )}

        <div className="gameSource">
          <a href={this.state.source_url}>{this.state.source_url}</a>
        </div>
      </div>
    );
  }
}


function TurnIndicator({ team, color, onClick}) {
  return (
    <div className='TurnIndicator' onClick={onClick}>
      <div className='TurnIndicator-text' style={{color: color}}>
        Team {team}'s turn
      </div>
    </div>
  )
}

function TopNavigation({ onNewGameClick, onSaveClick }) {
  return (
    <div className="TopNavigation">
      <div
        style={{
          padding: '10px',
          fontSize: '1em',
          marginLeft: '15px',
          fontWeight:'bold',
          color: '#495772',
        }}
      >
        trebek.
      </div>
      <div style={{flexGrow: '1'}}></div>
      <Button
        classes="nav-button"
        onClick={onNewGameClick}
        style={{
          fontSize: '.5em',
          backgroundColor: 'none',
        }}
        icon={<FaPlus />}
        text="New Game"
        color="rgb(65, 71, 82)"
      ></Button>
      <Button
        classes="nav-button"
        onClick={onSaveClick}
        style={{
          fontSize: '.5em',
          backgroundColor: 'none',
        }}
        icon={<FaRegSave />}
        text="Save Game"
        color="rgb(65, 71, 82)"
      ></Button>
    </div>
  );
}
export default App;
