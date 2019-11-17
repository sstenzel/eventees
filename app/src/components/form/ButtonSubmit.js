import React from "react";

const ButtonSubmit = props => {
    return (
      <div className="col-12">
        <div className="form__element">
          <div className="form__element__button">
            <button name={props.name} id={props.name} type="submit">
              {props.title}
            </button>
          </div>
        </div>
      </div>
    );
}

export default ButtonSubmit;
