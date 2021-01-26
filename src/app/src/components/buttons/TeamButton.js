import { FaCheck, FaTimes, FaMinus} from 'react-icons/fa';
import './Buttons.css'
export default function TeamButton({
  sensitive,
  team_id,
  color,
  onIncrement,
  onDecrement,
}) {
  let class_name = 'TeamButton';
  if (!sensitive) {
    class_name = `${class_name}`;
  }
  return (
    <div
      className={'TeamButton ' + (sensitive ? '' : ' insensitive')}
      style={{backgroundColor: color}}
    >
      <div
        class={'TeamButton-iconcontainer ' + (sensitive ? '' : ' insensitive')}
        style={{backgroundColor: color}}
        onClick={() => {
          if (sensitive) {
            onIncrement(team_id);
          }
        }}
      >
        <FaCheck className="TeamButton-icon" />
      </div>
      <div className="TeamButton-text">
        <div>Team {team_id}</div>
      </div>
      <div
        class={'TeamButton-iconcontainer ' + (sensitive ? '' : ' insensitive')}
        style={{backgroundColor: color}}
        onClick={() => {
          if (sensitive) {
            onDecrement(team_id);
          }
        }}
      >
        <FaTimes class="TeamButton-icon" />
      </div>
    </div>
  );
}
