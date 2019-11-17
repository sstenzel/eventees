import React, { Component } from "react";
import $ from "jquery";

import markerIcon from "./../../assets/icons/filters/sports/bicycle.png";

class MyEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onIconClick = () => {
    $(".map-section-myevents").toggleClass("active");
  };

  onEventClick = (eventId) => {
    $(".map-section-myevents").toggleClass("active");

    let event = [...this.props.events, ...this.props.participations].filter(event => event.id === eventId)[0];

    this.props.showSingleEvent(event);
  }

  render() {
    return (
      <div className="map-section map-section-myevents">
        <div className="map-section__inner">
          <div className="map-section__heading">
            <img
              className="map-section__heading__icon"
              src={markerIcon}
              alt="ikona"
            />
            <h3>Moje eventy</h3>
            <img
              onClick={this.onIconClick}
              src="/images/back.svg"
              alt="strzałka w lewo"
              className="back"
            />
          </div>
          <div className="map-section__content">
            <div className="map-section__content__element">
              <h4 className="heading active">Utworzone wydarzenia</h4>
              <div className="map-section-myevents__created">
                {this.props.events ? (
                  this.props.events.length > 0 ? (
                    this.props.events.map((event, key) => (
                      <div key={key} className="event-tile" onClick={() => this.onEventClick(event.id)}>
                        <img
                          src={`/images/category_images/${event.category_photo}`}
                          alt="kategoria zdjęcie"
                        />
                        <div className="event-tile__content">
                          <h4>{event.name}</h4>
                          <h6>{event.category_name}</h6>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{textAlign: "left"}}>Nie utworzyłeś jeszcze żadnego wydarzenia ;(</p>
                  )
                ) : <p style={{textAlign: "left"}}>Nie utworzyłeś jeszcze żadnego wydarzenia ;(</p>}
              </div>
            </div>
            <div className="map-section__content__element">
              <h4 className="heading active">Uczestnicze</h4>
              <div className="map-section-myevents__participation">
                {this.props.participations ? (
                  this.props.participations.length > 0 ? (
                    this.props.participations.map((event, key) => (
                      <div key={key} className="event-tile" onClick={() => this.onEventClick(event.id)}>
                        <img
                          src={`/images/category_images/${event.category_photo}`}
                          alt="kategoria zdjęcie"
                        />
                        <div className="event-tile__content">
                          <h4>{event.name}</h4>
                          <h6>{event.category_name}</h6>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{textAlign: "left"}}>Nie uczestniczysz w żadnym wydarzeniu ;(</p>
                  )
                ) : <p style={{textAlign: "left"}}>Nie uczestniczysz w żadnym wydarzeniu ;(</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyEvents;
