import React from "react";

const NavigationItem = (props) => {
  return (
    <li className={props.isActive ? "navigation__item active" : "navigation__item"} onClick={props.onNavItemClick}>
      <span role="link">
        <img src={props.icon} alt={props.iconAlt} />
        <h5>{props.content}</h5>
      </span>
    </li>
  );
}

export default NavigationItem;
