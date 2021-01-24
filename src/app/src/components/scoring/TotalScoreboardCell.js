export default function TotalScoreboardCell({score}) {
  return (
    <div className="TotalScoreboardCell">
      <div style={{fontSize: 'calc(3px + 2vmin)', backgroundColor: '#2f394b'}}>
        Total
      </div>
      {score}
    </div>
  );
} 