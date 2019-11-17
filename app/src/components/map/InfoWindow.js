import React, { Component } from "react";
import $ from "jquery";
import { InfoWindow } from "google-maps-react";

class InfoWindowContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      activeMarker: {},
      markerData: { event: {} }
    };
  }

  componentDidMount() {
    // this.props.onRef(this); // rodzic moze wywolywac stad funkcje
    let that = this;
    $(document).click(function(event) {
      if (event.target.parentNode.className === "infoWindow__button") {
        that.handleButtonClick();
      }
    });
  }

  onInfoWindowClose = () => {
    //console.log("onInfoWindowClose()");
    if (this.state.isVisible) {
      this.setState({
        isVisible: false,
        activeMarker: null
      });
    }
  };

  onInfoWindowOpen = (props, e) => {
    //console.log("onInfoWindowOpen()");
    // $(".infoWindow")
    //   .parent()
    //   .parent()
    //   .parent()
    //   .parent()
    //   .find("div")
    //   .first()
    //   .addClass("hide");
  };

  setActiveMarker = (markerProps, marker) => {
    //console.log("Set active marker");
    this.setState({
      markerData: markerProps,
      activeMarker: marker,
      isVisible: true
    });
    console.log(this.state);
  };

  handleButtonClick = () => {
    this.props.onButtonClick(this.state.markerData);
    $(".gm-ui-hover-effect")
      .delay(200)
      .click();
    // $('.infoWindow').fadeOut()
  };

  render() {
    let date = new Date();
    if (this.state.markerData.event !== undefined) {
      date = new Date(this.state.markerData.event.date);
    }
    return (
      <InfoWindow
        google={this.props.google}
        map={this.props.map}
        onClose={this.onInfoWindowClose}
        marker={this.state.activeMarker}
        visible={this.state.isVisible}
        onOpen={this.onInfoWindowOpen}
      >
        {/*--------- ZAWARTOSC INFOWINDOW -----------*/}
        {this.state.isVisible ? (
          <div className="infoWindow" id="infoWindow">
            <div className="infoWindow__content">
              <div className="infoWindow__description">
                <div className="date">
                  <div className="date__number">
                    <h5>
                      {new Intl.DateTimeFormat("pl-PL", {
                        day: "numeric"
                      }).format(date)}
                    </h5>
                  </div>
                  <div className="date__content">
                    <p>
                      {new Intl.DateTimeFormat("pl-PL", {
                        weekday: "long"
                      }).format(date)}
                    </p>
                    <p>
                      {new Intl.DateTimeFormat("pl-PL", {
                        month: "long",
                        year: "numeric"
                      }).format(date)}
                    </p>
                  </div>
                </div>
                <h4>{this.state.markerData.event.name}</h4>
                <h6>{this.state.markerData.event.category_name}</h6>
                <p className="time">
                  Zaczyna się o {this.state.markerData.event.time}
                </p>
              </div>
              <div className="infoWindow__button">
                <div className="places">
                  <p>
                    {this.state.markerData.event.slots_available} /{" "}
                    {this.state.markerData.event.slots_all}
                  </p>
                </div>
                <button type="button">></button>
              </div>
            </div>
          </div>
        ) : (
          <React.Fragment />
        )}
      </InfoWindow>
    );
  }
}

export default InfoWindowContainer;