import {FaCheck, FaTimes, FaPlus, FaMinus} from 'react-icons/fa'

export function Button({
    color,
    text,
    onClick,
    icon
}) {
    return (
        <div onClick={onClick} class='button' style={{backgroundColor: color, color: 'white'}}>
            {icon}
            { text &&
              <div>
                {text}
              </div>
            }
        </div>
    )
}

export function CorrectButton({ onClick }) {
    return (
      <Button
        onClick={onClick}
        color="#008000"
        text=""
        icon={<FaCheck />}
      />
    );
}

export function WrongButton({onClick}) {
  return (
    <Button
      onClick={onClick}
      color="#b20505"
      text=""
      icon={<FaTimes />}
    />
  );
}
