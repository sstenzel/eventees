import React, { Component } from "react";
import $ from "jquery";
import EventComments from "./EventComments";
import EventInvite from "./EventInvite";
import EventInfo from "./EventInfo";
import EventUpdate from "./EventUpdate";
import Loading from "./../Loading";

import markerIcon from "./../../../assets/icons/filters/sports/bicycle.png";

import { AppContext } from "./../../AppContext";

const API_PARTICIPATION = "http://localhost:8000/participation";
const API_GET_EVENT_PARTICIPANTS = "http://localhost:8000/event/participants";
const API_EVENT = "http://localhost:8000/event";

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      eventUpdate: {},
      isLoading: true,
      userIsParticipant: false,
      userIsCreator: false
    };
  }

  updateEventData = async event => {
    this.showEventInfo();
    await this.setState({
      event: event,
      eventUpdate: event,
      userIsParticipant: false,
      userIsCreator: false,
      isLoading: false
    });
    this.loadAdditionalData();
  };

  loadAdditionalData = async () => {
    let userIsParticipant = false;
    let userIsCreator = false;

    if (this.context.isAuth) {
      if (this.isUserEventParticipant(this.state.event.id)) {
        userIsParticipant = true;
      } else {
        userIsParticipant = false;
      }
      if (this.isUserEventCreator(this.state.event.id)) {
        userIsCreator = true;
      } else {
        userIsCreator = false;
      }
      if (userIsCreator || userIsParticipant || this.context.isAdmin) {
        this.getEventParticipants(this.state.event.id);
        // await this.getEventComments(this.state.event.id);
      } else {
        this.setState({ eventParticipants: [], eventComments: [] });
      }

      this.setState({
        userIsParticipant: userIsParticipant,
        userIsCreator: userIsCreator
      });
    }
  };

  isUserEventCreator = eventId => {
    return (
      this.context.userEvents.filter(event => event.id === eventId).length > 0
    );
  };

  isUserEventParticipant = eventId => {
    return (
      this.context.userParticipations.filter(event => event.id === eventId)
        .length > 0
    );
  };

  deleteEvent = e => {
    e.preventDefault();

    fetch(`${API_EVENT}/${this.state.event.id}`, {
      method: "delete",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        api_token: this.context.token
      }
    })
      .then(res => {
        res.json();
        console.log(res);
        if (res.status === 200) {
          this.context.showInfo(true, "Wydarzenie zostalo usuniete");
          this.context.getUserParticipations();
          this.context.getUserEvents();
          this.props.updateEvents();
          $(".map-section-event").toggleClass("active");
        }
      })
      .catch(err => {
        console.log(err);
        this.context.showInfo(false);
      });
  };

  updateEvent = e => {
    e.preventDefault();

    let postData = {};

    for (let key of Object.keys(this.state.eventUpdate)) {
      if (key.includes("eventUpdate")) {
        console.log(key, this.state.eventUpdate[key]);
        postData[key.replace("eventUpdate_", "")] = this.state.eventUpdate[key];
      }
    }

    console.log(postData);

    fetch(`${API_EVENT}/${this.state.event.id}`, {
      method: "put",
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
          this.context.showInfo(true, "Pomyślnie zaktualizowano wydarzenie");
          this.props.updateEvents();
          this.showEventInf();
        }
      })
      .catch(err => {
        console.log(err);
        this.context.showInfo(false);
      });
  };

  addParticipation = async e => {
    e.preventDefault();

    if (this.context.isAuth) {
      let postData = {
        event_id: parseInt(this.state.event.id)
      };
      console.log(postData);

      await fetch(API_PARTICIPATION, {
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
          if (res.status === 422) {
            this.context.showInfo(false);
          } else {
            if (res.status === 200) {
              this.context.showInfo(
                true,
                "Dołączyłeś do wydarzenia: " + this.state.event.name
              );
              this.context.hideAllSections();
              this.context.getUserParticipations();
              this.props.updateEvents();
            }
          }
        })
        .catch(err => {
          console.log(err);
          this.context.showInfo(false);
        });
    } else {
      this.context.toggleShowPopup("login");
    }
  };

  removeParticipation = e => {
    e.preventDefault();

    fetch(`${API_PARTICIPATION}/${this.state.event.id}`, {
      method: "delete",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        api_token: this.context.token
      }
    })
      .then(res => {
        res.json();
        console.log(res);
        if (res.status === 200) {
          this.context.showInfo(
            true,
            "Opuściłes wydarzenie" + this.state.event.name
          );
          this.context.hideAllSections();
          this.context.getUserParticipations();
          this.props.updateEvents();
        }
      })
      .catch(err => {
        console.log(err);
        this.showInfo(false);
      });
  };

  getEventParticipants = eventId => {
    fetch(`${API_GET_EVENT_PARTICIPANTS}/${eventId}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        api_token: this.context.token
      }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.setState({ eventParticipants: res });
      })
      .catch(err => {
        console.log(err);
        this.context.showInfo(false);
      });
  };

  removeParticipant = participantId => {
    let postData = {
      user_id: participantId,
      event_id: this.state.event.id
    };
    console.log(postData);
    fetch(`${API_PARTICIPATION}/`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        api_token: this.context.token
      },
      body: JSON.stringify(postData)
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.getEventParticipants(this.state.event.id);
      })
      .catch(err => {
        console.log(err);
        this.context.showInfo(false);
      });
  };

  onIconClick = () => {
    $(".map-section-event").toggleClass("active");
  };

  showEventEditForm = () => {
    $(".event-info").slideUp();
    $(".event-form").slideDown();
  };

  showEventInfo = () => {
    $(".event-info").slideDown();
    $(".event-form").slideUp();
  };

  handleChange = e => {
    let eventUpdate = { ...this.state.eventUpdate };
    console.log(eventUpdate);
    eventUpdate[e.target.name] = e.target.value;
    this.setState({ eventUpdate });
    console.log(this.state.eventUpdate);
  };

  render() {
    if (this.state.isLoading) {
      return (
        <Loading
          sectionName="event"
          icon={markerIcon}
          onIconClick={this.onIconClick}
        />
      );
    }

    return (
      <div className="map-section map-section-event">
        <div className="map-section__inner map-section__inner--button">
          <div className="map-section__heading">
            <img
              className="map-section__heading__icon"
              src={markerIcon}
              alt="ikona"
            />
            <h3>{this.state.event.name}</h3>
            <img
              onClick={this.onIconClick}
              src="/images/back.svg"
              alt="strzałka w lewo"
              className="back"
            />
          </div>
          <div className="map-section__content">
            <div className="map-section__content__image">
              <img
                src={
                  "/images/category_images/" + this.state.event.category_photo
                }
                alt="sport zdjęcie"
              />
              <div className="map-section__content__image__overlay">
                <p>{this.state.event.category_name}</p>
              </div>
            </div>

            <div className="event-info">
              <EventInfo
                eventParticipants={this.state.eventParticipants}
                event={this.state.event}
                removeParticipant={this.removeParticipant}
                userIsCreator={this.state.userIsCreator}
              />

              {this.state.userIsCreator ||
              this.state.userIsParticipant ||
              this.context.isAdmin ? (
                <React.Fragment>
                  <EventComments eventId={this.state.event.id} />
                  <EventInvite eventId={this.state.event.id} />
                </React.Fragment>
              ) : (
                <React.Fragment />
              )}
              {this.state.userIsCreator || this.context.isAdmin ? (
                <>
                  <div className="button-group">
                    <div className="button__outer">
                      <button type="button" onClick={this.showEventEditForm}>
                        Edytuj wydarzenie
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>

            {this.state.userIsCreator || this.context.isAdmin ? (
              <>
                <div className="event-form" style={{ display: "none" }}>
                  <EventUpdate
                    event={this.state.eventUpdate}
                    updateEvent={this.updateEvent}
                    handleChange={this.handleChange}
                  />
                  <div className="button-group">
                    <div className="button__outer">
                      <button type="button" onClick={this.showEventInfo}>
                        Pokaż wydarzenie
                      </button>
                    </div>
                  </div>
                </div>
                <div className="button__outer">
                  <button type="button" onClick={this.deleteEvent}>
                    Usuń wydarzenie
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="map-section__button">
            {this.state.userIsParticipant ? (
              <button type="button" onClick={this.removeParticipation}>
                Opuść wydarzenie
              </button>
            ) : this.state.event.slots_available === 0 ? (
              <button className="button-info" type="button">
                Brak wolnych miejsc
              </button>
            ) : (
              <button type="button" onClick={this.addParticipation}>
                Dołącz do wydarzenia
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

Event.contextType = AppContext;

export default Event;
