export default function ScoreBoardCell({value, style, onClick}) {
  return (
    <div className="Scoreboard-cell" style={style} onClick={onClick}>
      {value}
    </div>
  );
}
