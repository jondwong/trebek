import './Scoring.css'

export function VerticalScoreboard({team_points, team_colors}) {

    let score_containers = Object.keys(team_points).map((team_key)=>{
        return (
            <div className='VerticalScoreboard-container'>
                <div style={{backgroundColor: team_colors[team_key]}} className='VerticalScoreboard-container-header'>Team {team_key}</div>
                <div className='VerticalScoreboard-container-points'>{team_points[team_key]}</div>
            </div>
        )
    });

    return(
        <div className='VerticalScoreboard'>
            {
                score_containers
            }
        </div>
    )
}