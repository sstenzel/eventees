import React, { Component } from "react";
import $ from "jquery";

import smiley from "./../../assets/icons/popup/smiley3.svg";

class WelcomeScreen extends Component {
  componentDidMount() {
    const welcomeScreen = this.refs.welcomeScreen;
    $(welcomeScreen).fadeIn();
    $(document).mouseup(function(e) {
      if (!welcomeScreen.firstChild.contains(e.target)) {
        $(welcomeScreen).fadeOut();
      }
    });
  }

  hideWelcomeScreen = () => {
    const welcomeScreen = this.refs.welcomeScreen;
    $(welcomeScreen).fadeOut();
  }

  render() {
    return (
      <div
        className="popup popup--welcome"
        style={{ display: "none" }}
        ref="welcomeScreen"
      >
        <div className="popup__inner">
          <img src={smiley} alt="smiley" />
          <h2>Welcome!</h2>
          <p>Witaj w aplikacji <span>Eventees</span><br/>Twórz nowe Wydarzenia. Bierz udział w istniejących.<br/>i wiele więcej...</p>
          <button className="popup__button" onClick={this.hideWelcomeScreen}>
            Zobacz wydarzenia
          </button>
        </div>
      </div>
    );
  }
}

// WelcomeScreen.contextType = AppContext;

export default WelcomeScreen;
