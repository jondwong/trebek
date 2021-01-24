export default function TeamScoreboardCell({ name, color }) {
    return (
        <div className="TeamScoreboardCell" style={{backgroundColor:color}}>
            {name}
        </div>
    )
}