import React, { Component } from "react";
import $ from "jquery";

import smileySad from "./../../assets/icons/popup/smiley2.svg";
import smileyHappy from "./../../assets/icons/popup/smiley4.svg";

import { AppContext } from "../AppContext";

class Popup extends Component {
  componentDidMount(){
    const popup = this.refs.popup;
    $(document).mouseup(function(e) {
      if (!popup.firstChild.contains(e.target)) {
        $(popup).fadeOut();
      }
    });
  }

  showLoginForm = () => {
    $(`.popup--${this.props.type}`).fadeOut();
    $(".map-section-profile").addClass("active");
  };

  hidePopup = () => {
    $(`.popup--${this.props.type}`).fadeOut();
  }

  render() {
    return (
      <div
        className={`popup popup--${this.props.type}`}
        style={{ display: "none" }}
        ref="popup"
      >
        <div className="popup__inner">
          {this.props.type === "login" ? (
            <>
              <img src={smileySad} alt="smiley" />
              <h2>Oops!</h2>
              <p>Aby przejść dalej musisz się zalogować</p>
              <button className="popup__button" onClick={this.showLoginForm}>
                Zaloguj się
              </button>
            </>
          ) : (
            <></>
          )}
          {this.props.type === "error" ? (
            <>
              <img src={smileySad} alt="smiley" />
              <h2>Oops!</h2>
              <p>Wystąpił błąd. :(</p>
              <button className="popup__button" onClick={this.hidePopup}>
                Zamknij
              </button>
            </>
          ) : (
            <></>
          )}
          {this.props.type === "success" ? (
            <>
              <img src={smileyHappy} alt="smiley" />
              <h2>Yeey!</h2>
              <p>Udało się! :)</p>
              <button className="popup__button" onClick={this.hidePopup}>
                Zamknij
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
}

Popup.contextType = AppContext;

export default Popup;
