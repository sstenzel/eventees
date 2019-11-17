import React, { Component } from "react";
import Input from "./../../form/Input";
import ButtonSubmit from "./../../form/ButtonSubmit";

import loginIcon from "./../../../assets/icons/profile/user.svg";

import { AppContext } from "./../../AppContext";

const API_INVITATION = "http://localhost:8000/invitation";

class EventInvite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invitation_login: ''
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
  };

  inviteUser = e => {
    e.preventDefault();
    let postData = {
      event_id: parseInt(this.props.eventId),
      login: this.state.invitation_login
    };

    console.log(postData);

    fetch(API_INVITATION, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        api_token: this.context.token
      },
      body: JSON.stringify(postData)
    })
      .then(res => {
        res.json();
        console.log(res);
        if (res.status === 200) {
          this.context.showInfo(true,
            "Zaprosiłeś użytkownika z loginem: " + postData.login
          );
        } else{
          this.context.showInfo(false,
            "Nie udało się zaprosić użytkownika z loginem: " + postData.login
          );
        }
        this.setState({invitation_login: ''});
      })
      .catch(err => this.context.showInfo(false));
  };

  render() {
    return (
      <div className="map-section__content__element folded">
        <h4
          className="heading active"
          onClick={this.context.animateSectionElement}
        >
          Zaproś znajomego
        </h4>
        <div
          className="map-section-event__invitation"
          style={{ display: "none" }}
        >
          <form onSubmit={this.inviteUser}>
            <div className="row">
              <Input
                icon={loginIcon}
                title="Login"
                name="invitation_login"
                placeholder="Wpisz login użytkownika"
                type="text"
                onChange={this.handleChange}
                value={this.state.invitation_login}
              />
              <ButtonSubmit
                title="Zaproś znajomego"
                name="invitation_submit"
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

EventInvite.contextType = AppContext;

export default EventInvite;
