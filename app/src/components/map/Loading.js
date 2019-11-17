import React from "react";

const Loading = props => {
  return (
    <div className={`map-section map-section-${props.sectionName}`}>
      <div className="map-section__inner map-section__inner--button">
        <div className="map-section__heading">
          <img
            className="map-section__heading__icon"
            src={props.icon}
            alt="ikona"
          />
          <h3>Ładuję</h3>
          <img
            onClick={props.onIconClick}
            src="/images/back.svg"
            alt="strzałka w lewo"
            className="back"
          />
        </div>
        <div className="map-section__content">
          <div className="lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
