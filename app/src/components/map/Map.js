import React, { Component } from "react";
// import shouldPureComponentUpdate from "react-pure-render/function";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import $ from "jquery";
import InfoWindowContainer from "./InfoWindow";
import mapStyles from "./mapStyles.json";

import Search from "./Search.js";
import Profile from "./../profile/Profile.js";
import Filters from "./filters/Filters";
import AddEvent from "./AddEvent";
import MyEvents from "./MyEvents";
import Invitations from "./Invitations";
import Event from "./event/Event";

import { AppContext } from "./../AppContext";

const API_EVENT = "http://localhost:8000/event";

export class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      style: mapStyles.light,
      styleWithCustomCursor: {},
      showSingleEvent: false,
      center: {
        lat: 54.372158,
        lng: 18.658306
      },
      singleEventPrepare: {},
      participantsPrepare: []
    };

    this.addMarkerMode = false;
  }

  // shouldComponentUpdate = shouldPureComponentUpdate;

  async componentDidMount() {
    this.props.onRef(this);
    await this.getAllEvents();
    this.loadMap();
  }

  componentDidUpdate() {
    console.log("MapContainer Updated");
    this.setTheme();
  }

  loadMap = () => {
    this.map.map.addListener("maptypeid_changed", this.setTheme);
    // this.map.map.addListener("bounds_changed", this.onBoundsChanged);

    this.map.map.setOptions({
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: this.props.google.maps.MapTypeControlStyle.DEFAULT,
        mapTypeIds: ["roadmap", "hybrid"]
      }
    });
  };

  getAllEvents = () => {
    fetch(API_EVENT)
      .then(response => response.json())
      .then(data =>
        this.setState({ data }, () => console.log(this.state.data))
      )
      .catch(err => this.context.showInfo(false));
  };

  getUserEvents = () => {
    let userEvents = [
      ...this.context.userEvents,
      ...this.context.userParticipations
    ];
    this.setState({ data: userEvents }, () => console.log(this.state.data));
  };

  onMarkerClick = (markerProps, marker, e) => {
    this.context.hideAllSections();
    this.infoWindow.setActiveMarker(markerProps, marker);
    this.recenterMap(markerProps.position);
    this.eventInfo.updateEventData(markerProps.event);
  };

  onInfoWindowButtonClick = () => {
    $(".map-section-event").addClass("active");
  };

  showSingleEvent = async (event, eventId) => {
    this.context.hideAllSections();
    this.recenterMap({ lat: event.latitude, lng: event.longitude });
    if (eventId) {
      event = await this.state.data.filter(event => parseInt(event.id) === parseInt(eventId))[0];
    }
    await this.eventInfo.updateEventData(event);

    $(".map-section-event").addClass("active");
  };

  onMapClick = (mapProps, map, e) => {
    // console.log("map clicked");
    if (this.addMarkerMode) {
      this.addEvent.setAddress(e.latLng, e);
      this.createNewMarker(e.latLng);
    } else {
      this.context.hideAllSections();
      this.infoWindow.onInfoWindowClose();
    }
  };

  createNewMarker = location => {
    const lat = location.lat();
    const lng = location.lng();
    new this.props.google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: this.map.map,
      title: "Dodaj wydarzenie",
      icon: "./images/markers/blank.png"
    });
  };

  setAddMarkerMode = () => {
    this.addMarkerMode = !this.addMarkerMode;
    if (this.addMarkerMode) {
      this.map.map.setOptions({
        draggableCursor: "url(./icons.search.svg), crosshair"
      });
    } else {
      this.map.map.setOptions({ draggableCursor: "default" });
    }
  };

  recenterMap = position => {
    this.map.map.panTo(
      new window.google.maps.LatLng(position.lat, position.lng)
    );
  };

  setMapZoom = zoom => {
    this.map.map.setZoom(zoom);
  };

  // onBoundsChanged = () => {
  //   console.log("onBoundsChanged");
  //   // this.setState({center: this.map.props.center});
  //   console.log(this.map);
  //   let zoom = this.map.map.getZoom();
  //   let center = this.map.state.currentLocation;
  //   console.log({
  //     zoom,
  //     center
  //   });
  // };

  setTheme = () => {
    let mapStylesTheme = mapStyles.none;
    if (this.map.map.getMapTypeId() === "hybrid") {
      mapStylesTheme = mapStyles.none;
    } else {
      if (this.context.theme === "light") {
        mapStylesTheme = mapStyles.light;
      } else {
        mapStylesTheme = mapStyles.night;
      }
    }
    this.map.map.setOptions({ styles: mapStylesTheme });
  };

  filterPoints = postData => {
    // console.log(postData);

    fetch(`${API_EVENT}/all`, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        api_token: this.context.token
      },
      body: JSON.stringify(postData)
    })
      .then(response => response.json())
      .then(data =>
        this.setState({ data }, () => console.log(this.state.data))
      )
      .catch(err => this.context.showInfo(false));
  };

  render() {
    return (
      <div className="map">
        <div className="map__inner">
          <Map
            yesIWantToUseGoogleMapApiInternals
            ref={map => (this.map = map)}
            google={this.props.google}
            initialCenter={{
              lat: 54.372158,
              lng: 18.658306
            }}
            zoom={9}
            center={this.state.center}
            onClick={this.onMapClick}
            // onClick={this._onClick}
            centerAroundCurrentLocation
            styles={this.state.style}
            onChange={this.onChange}
            onBoundsChange={this._onBoundsChange}
          >
            {this.state.data.map((event, key) => (
              <Marker
                key={key}
                id={event.id}
                icon={"./images/markers/" + event.category_markup}
                event={event}
                onClick={this.onMarkerClick}
                onMouseover={this.onMouseoverMarker}
                position={{
                  lat: event.latitude,
                  lng: event.longitude
                }}
              />
            ))}

            {/*TODO dodac kategorie "other"*/}

            <InfoWindowContainer
              onButtonClick={this.onInfoWindowButtonClick}
              ref={ref => (this.infoWindow = ref)}
            />
          </Map>
          <Filters
            google={this.props.google}
            filterPoints={this.filterPoints}
          />
          {this.context.isAuth ? (
          <>
          <MyEvents
            events={this.context.userEvents}
            participations={this.context.userParticipations}
            showSingleEvent={this.showSingleEvent}
          />
            <Invitations
              events={this.state.data}
              showSingleEvent={this.showSingleEvent}
            /></>
          ) : (
            <React.Fragment />
          )}

          <Search
            google={this.props.google}
            recenterMap={this.recenterMap}
            setMapZoom={this.setMapZoom}
          />
          <AddEvent
            ref={ref => (this.addEvent = ref)}
            map={this.map}
            createNewMarker={this.createNewMarker}
            setAddMarkerMode={this.setAddMarkerMode}
            updateEvents={this.getAllEvents}
          />

          <Profile />

          <Event
            google={this.props.google}
            updateEvents={this.getAllEvents}
            ref={ref => (this.eventInfo = ref)}
          />
        </div>
      </div>
    );
  }
}

MapContainer.contextType = AppContext;

export default GoogleApiWrapper({
  apiKey: "AIzaSyDS736oOlFQ-sw7ygVdY6Mxdg0QuDg9saU"
})(MapContainer);

// export default GoogleApiWrapper({
//   apiKey: "AIzaSyBqBO1USsRiDqN13RpVH3EGC9bNqzmmuUA"
// })(MapContainer);

// export default GoogleApiWrapper({
//   apiKey: "AIzaSyBz4MPKhO4nFcmUnMLDnwBpId3Pt-3PZVE"
// })(MapContainer);
