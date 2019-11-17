import React from "react";

const Input = props => {
  return (
    <div className="col-12">
      <div className="form__element">
        <div className="form__element__image">
          <img src={props.icon} alt="form icon" />
        </div>
        <div className="form__element__content">
          <label htmlFor={props.name}>{props.title}</label>
          {props.required ? (
            <input
              id={props.name}
              name={props.name}
              type={props.type}
              placeholder={props.placeholder}
              value={props.value}
              onChange={props.onChange}
              pattern={props.pattern}
              required
            />
          ) : props.type === "file" ? (
            <input
              id={props.name}
              name={props.name}
              type={props.type}
              onChange={props.onChange}
              accept="image/*"
            />
          ) : (
            <input
              id={props.name}
              name={props.name}
              type={props.type}
              placeholder={props.placeholder}
              value={props.value}
              onChange={props.onChange}
              pattern={props.pattern}
            />
          )}
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
