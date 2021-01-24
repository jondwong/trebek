import TeamScoreboardCell from './TeamScoreboardCell'
import ScoreBoardCell from './ScoreboardCell'
import TotalScoreboardCell from './TotalScoreboardCell'
import './Scoring.css'

export default function Scoreboard({
  team_answered_questions,
  questions,
  team_points,
  team_colors,
  current_question_index,
  onCellClick
}) {
  let rows = Object.keys(team_points).map((team_id) => {
    return (
      <div className="Scoreboard-row">
        {[
          <TeamScoreboardCell
            color={team_colors[team_id]}
            name={'Team ' + team_id}
          />,
        ]
          .concat(
            questions.map((q, idx) => {
              let style = {};

              if (idx == current_question_index) {
                style.backgroundColor = '#2d3546bd';
              }

              if (
                team_answered_questions[q.id] &&
                team_answered_questions[q.id][team_id]
              ) {
                return (
                  <ScoreBoardCell
                    value={team_answered_questions[q.id][team_id]}
                    style={style}
                    onClick={()=>{
                        onCellClick(q.id, idx);
                    }}
                  />
                );
              }
              return (
                <ScoreBoardCell
                  style={style}
                  onClick={() => {
                    onCellClick(q.id, idx);
                  }}
                />
              );
            })
          )
          .concat([<TotalScoreboardCell score={team_points[team_id]} />])}
      </div>
    );
  });

  return <div className="Scoreboard">{rows}</div>;
}
