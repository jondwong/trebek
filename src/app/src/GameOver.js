import './GameOver.css'

export default function GameOver({ team_points = {} }) {
    let unique_pts = {};
    let sorted_pts = Object.keys(team_points).map((team_id) => {
        unique_pts[team_points[team_id]] = true;
        return {
           id: team_id,
           points: team_points[team_id]
       };
    }).sort((a,b)=>{
        return b.points - a.points
    });

    console.log(unique_pts);
    console.log(sorted_pts);

    let winner = "";
    if(Object.keys(unique_pts).length == 1) {
        winner = "It's a TIE!";
    } else {
        winner = `Team ${sorted_pts[0].id} wins!`
    }

    return (
      <div className="GameOver">
        <div class="pyro">
          <div class="before"></div>
          <div class="after"></div>
        </div>

        <div class="GameOver-text">
            {
                winner
            }
        </div>
      </div>
    );
}