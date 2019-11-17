import React from "react";

const Input = props => {
  return (
    <div className="col-12">
      <div className="form__element">
        <div className="form__element__content form__element__content---checkbox">
          <input
            id={props.name}
            name={props.name}
            type={props.type}
            onChange={props.onChange}
          />
          <label htmlFor={props.name}>{props.title}</label>
          <span
            className={`${props.name.split("_")[0]}-error`}
            id={`${props.name}-error`}
          />
        </div>
      </div>
    </div>
  );
};

export default Input;
