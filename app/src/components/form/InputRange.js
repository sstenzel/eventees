import React from "react";

const InputRange = props => {
  return (
    <div className="col-12">
      <div className="form__element">
        <div className="form__element__image">
          <img src={props.icon} alt="form icon" />
        </div>
        <div className="form__element__content">
          <label htmlFor={props.nameFrom}>{props.title}</label>
          <div className="row">
            <div className="col-6 pl-0" style={{ paddingRight: "10px" }}>
              <input
                id={props.nameFrom}
                name={props.nameFrom}
                type={props.type}
                placeholder={props.placeholderFrom}
                onChange={props.onChange}
              />
            </div>
            <div className="col-6 pr-0">
              <input
                id={props.nameTo}
                name={props.nameTo}
                type={props.type}
                placeholder={props.placeholderTo}
                onChange={props.onChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputRange;
