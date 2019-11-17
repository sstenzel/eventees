import React from "react";

const Textarea = props => {
  return (
    <div className="col-12">
      <div className="form__element">
        <div className="form__element__image">
          <img src={props.icon} alt="form icon" />
        </div>
        <div className="form__element__content">
          <textarea
            id={props.name}
            name={props.name}
            placeholder={props.placeholder}
            onChange={props.onChange}
            value={props.value}
          />
        </div>
      </div>
    </div>
  );
};

export default Textarea;
