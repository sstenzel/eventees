/* eslint-disable no-unused-expressions */
import React, { Component } from "react";
import $ from "jquery";

import markerIcon from "./../../assets/icons/filters/sports/bicycle.png";

import { AppContext } from "./../AppContext";

const API_INVITATIONS = "http://localhost:8000/user/invitations";
const API_INVITATION = "http://localhost:8000/invitation";


class Invitations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetchingData: true
    };

    this.sendInvitationResponse = this.sendInvitationResponse.bind(this);
  }

  componentWillMount() {
    this.getUserInvitations();
  }

  getDateTime = (date, time) => {
    let dateTime = new Date(date + " " + time);
    return (
      dateTime.toLocaleDateString() +
      " o " +
      dateTime.getHours() +
      ":" +
      dateTime.getMinutes()
    );
  };

  getUserInvitations = () => {
    fetch(API_INVITATIONS, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        api_token: this.context.token
      }
    })
      .then(response => response.json())
      .then(data =>
        this.setState({
          invitations: data,
          isFetchingData: false
        })
      );
  };

  onIconClick = () => {
    $(".map-section-invitations").toggleClass("active");
  };

  onEventClick = async eventId => {
    $(".map-section-invitations").toggleClass("active");
    let event = await [...this.props.events].filter(ev => ev.id === eventId)[0];
    this.props.showSingleEvent(event, eventId);
  };

  sendInvitationResponse = (e, event_id, accepted, invitation) => {
    let data = {
      event_id: parseInt(event_id),
      accepted: accepted
    };

    fetch(API_INVITATION, {
      method: "put",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        api_token: this.context.token
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        res.json();
        console.log(res);

        if (res.status === 200) {
          let inv = this.state.invitations.filter(function(item) {
            return item !== invitation;
          });
          this.setState({ invitations: inv });
          if (accepted)
            this.context.showInfo(true, "Zaakceptowałeś zaproszenie");
          else this.context.showInfo(true, "Odrzuciłeś zaproszenie");
        }
      })
      .catch(err => this.showInfo(false));
  };

  render() {
    return (
      <div className="map-section map-section-invitations">
        <div className="map-section__inner">
          <div className="map-section__heading">
            <img
              className="map-section__heading__icon"
              src={markerIcon}
              alt="ikona"
            />
            <h3>Zaproszenia</h3>
            <img
              onClick={this.onIconClick}
              src="/images/back.svg"
              alt="strzałka w lewo"
              className="back"
            />
          </div>
          <div className="map-section__content">
            {!this.state.isFetchingData ? (
              this.state.invitations.length > 0 ? (
                this.state.invitations.map((invitation, key) => (
                  <div key={key} className="invitation-tile">
                    <img
                      src={`/images/category_images/${
                        invitation.category_photo
                      }`}
                      alt="kategoria zdjęcie"
                      className="background"
                    />
                    <div className="invitation-tile__content">
                      <div
                        className="invitation-tile__content__left"
                        onClick={() => this.onEventClick(invitation.event_id)}
                      >
                        <h5>{invitation.author_login}</h5>
                        <h6 className="white">zaprasza na</h6>
                        <h4>{invitation.event_name}</h4>
                      </div>
                      <div className="invitation-tile__content__right">
                        <h6 className="orange">
                          {this.getDateTime(
                            invitation.event_date,
                            invitation.event_time
                          )}
                        </h6>
                        <h6 className="white">{invitation.event_place}</h6>
                        <img
                          onClick={e =>
                            this.sendInvitationResponse(
                              e,
                              invitation.event_id,
                              true,
                              invitation
                            )
                          }
                          src="/images/checkmark.svg"
                          alt="akceptuj"
                        />
                        <img
                          onClick={e =>
                            this.sendInvitationResponse(
                              e,
                              invitation.event_id,
                              false,
                              invitation
                            )
                          }
                          src="/images/x.svg"
                          alt="odrzuć"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "left" }}>
                  Nie dostałeś jeszcze zaproszenia ;/
                </p>
              )
            ) : (
              <React.Fragment />
            )}
          </div>
        </div>
      </div>
    );
  }
}

Invitations.contextType = AppContext;

export default Invitations;
