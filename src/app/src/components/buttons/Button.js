import './Buttons.css';
export default function Button({  color, text, onClick, icon, classes ="", style = {}}) {
  let styles = {
      ...{backgroundColor: color, color: 'white'},
      ...style
  };

  let inner_div_style = {};
  if(icon) {
      inner_div_style.marginLeft = '10px';
  }

  return (
    <div
      onClick={onClick}
      class={"button " + classes}
      style={styles}
    >
      {icon}
      {text && <div style={inner_div_style}>{text}</div>}
    </div>
  );
}
