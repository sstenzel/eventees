import React, { Component } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import $ from "jquery";
import Input from "./../form/Input";
// import ButtonSubmit from "./../form/ButtonSubmit";

import add_eventIcon from "./../../assets/icons/add.svg";
//import settingsIcon from "./../../icons/filters/settings.svg";
import markerIcon from "./../../assets/icons/filters/marker.svg";
import peopleIcon from "./../../assets/icons/filters/people.svg";
import calendarIcon from "./../../assets/icons/filters/calendar.svg";
import timeIcon from "./../../assets/icons/event/time.svg";
import nameIcon from "./../../assets/icons/event/name.svg";
import descriptionIcon from "./../../assets/icons/event/description.svg";
import categoryIcon from "./../../assets/icons/event/category.svg";
import searchIcon from "./../../assets/icons/event/search.svg";

import { AppContext } from "./../AppContext";

const API_GET_CATEGORIES = "http://localhost:8000/category";
const API_ADD_EVENT = "http://localhost:8000/event";

class AddEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],

      addressFromCoords: [],

      isActive: false,
      isSearchActive: false,
      placeChosen: false,
      address: "",

      eventAdd_name: "",
      eventAdd_map: null,
      eventAdd_date: null,
      eventAdd_description: null,
      eventAdd_category: "1",
      eventAdd_amount_free: null,
      eventAdd_address: ""
    };

    this.onIconClick = this.onIconClick.bind(this);
    // this.handleSelectChange = this.handleSelectChange.bind(this);
    // this.handleSelect = this.handleSelect.bind(this);
    this.setAddress = this.setAddress.bind(this);
    this.add = this.add.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    fetch(API_GET_CATEGORIES)
      .then(response => response.json())
      .then(data => this.setState({ categories: data }))
      .catch(err => this.context.showInfo(false));
  }

  async add(e) {
    e.preventDefault();
    console.log("add Event: add()");

    let postData = {
      name: this.state.eventAdd_name,
      description: this.state.eventAdd_description,
      date: this.state.eventAdd_date,
      time: this.state.eventAdd_time,
      slots_available: this.state.eventAdd_amount_free,
      slots_all: this.state.eventAdd_amount_all,
      category_id: this.state.eventAdd_category,
      latitude: this.state.location.lat.toString(),
      longitude: this.state.location.lng.toString(),
      adress_description: this.state.eventAdd_address
    };

    console.log(postData);

    await fetch(API_ADD_EVENT, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        api_token: this.context.token
      },
      body: JSON.stringify(postData)
    })
      .then(res => res.json())
      .then(res => {
        if(res.status === "OK"){
          this.context.getUserEvents();
          this.context.showInfo(true,"Dodałeś nowe wydarzenie");
          this.clearForm();
          this.props.updateEvents();
        } else{
          this.context.showInfo(false);
        }
      })
      .catch(err => this.context.showInfo(false));

    // this.props.updateEvents();
    // this.clearForm();
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
  }

  handleSelectChange = address => {
    console.log('select change');
    this.setState({
      eventAdd_address: address,
      isSearchActive: !this.state.isSearchActive
    });
  };

  handleSelect = address => {
    console.log('select select');
    this.setState({ isSearchActive: !this.state.isSearchActive });
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({ location: latLng }))
      .catch(error => console.error("Error", error));
    this.setState({ eventAdd_address: address });
    this.setState({ placeChosen: !this.state.placeChosen });
  };

  async setAddress(location) {
    this.setState({ placeChosen: !this.state.placeChosen });

    const lat = location.lat();
    const lng = location.lng();

    await fetch(
      "https://us1.locationiq.com/v1/reverse.php?key=fd3074b2efc2ae&lat=" +
        lat +
        "&lon=" +
        lng +
        "&format=json&fbclid=IwAR0Bro5T5FIz7Ifc5gEfbUK-OZwdblGuihvrE-0o0rjdC_LZmug6br_K8pw"
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          addressFromCoords: data,
          eventAdd_address: data.display_name,
          location: {
            lat: lat,
            lng: lng
          }
        })
      );
    this.props.setAddMarkerMode();
  }

  clearForm = () => {
    console.log("clear");
    $('.map-section-add_event input').each(() => {
      $(this).val('');
    })
  };

  onIconClick() {
    if (this.context.isAuth) {
      this.context.hideAllSections();
      $(".map-section-add_event").toggleClass("active");
    } else {
      this.context.toggleShowPopup("login");
    }
  }

  onArrowClick = () => {
    $(".map-section-add_event").removeClass("active");
  };

  render() {
    return (
      <div className="map-section map-section-add_event">
        <div
          className="map__icon map-section-add_eventAdd__icon"
          onClick={this.onIconClick}
        >
          <img src={add_eventIcon} alt="add_event" />
        </div>
        {this.context.isAuth ? (
          <div className="map-section__inner">
            <div className="map-section__heading">
              <img
                className="map-section__heading__icon"
                src={add_eventIcon}
                alt="add_event"
              />
              <h3>Nowe wydarzenie</h3>
              <img
                onClick={this.onArrowClick}
                src="/images/back.svg"
                alt="strzałka w lewo"
                className="back"
              />
            </div>
            <div className="map-section__content">
              <form onSubmit={this.add}>
                <div className="row">
                  <Input
                    icon={nameIcon}
                    title="Nazwa"
                    name="eventAdd_name"
                    placeholder="Wpisz nazwę"
                    type="text"
                    onChange={this.handleChange}
                  />
                  <Input
                    icon={descriptionIcon}
                    title="Opis"
                    name="eventAdd_description"
                    placeholder="Wpisz opis"
                    type="text"
                    onChange={this.handleChange}
                  />
                  <Input
                    icon={calendarIcon}
                    title="Data"
                    name="eventAdd_date"
                    placeholder="Podaj datę"
                    type="date"
                    onChange={this.handleChange}
                  />
                  <Input
                    icon={timeIcon}
                    title="Godzina"
                    name="eventAdd_time"
                    placeholder="Podaj datę"
                    type="time"
                    onChange={this.handleChange}
                  />
                  <Input
                    icon={timeIcon}
                    title="Ilość miejsc"
                    name="eventAdd_amount_all"
                    placeholder="Wpisz ilość miejsc"
                    type="number"
                    onChange={this.handleChange}
                  />
                  <Input
                    icon={peopleIcon}
                    title="Ilość wolnych miejsc"
                    name="eventAdd_amount_free"
                    placeholder="Wpisz ilość wolnych miejsc"
                    type="number"
                    onChange={this.handleChange}
                  />
                  <div className="col-12">
                    <div className="form__element">
                      <div className="form__element__image">
                        <img src={categoryIcon} alt="icon" />
                      </div>
                      <div className="form__element__content">
                        <label htmlFor="eventAdd_category">Kategoria</label>
                        <div className="custom-dropdown">
                          <select
                            name="eventAdd_category"
                            onChange={this.handleChange}
                          >
                            {this.state.categories.map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form__element">
                      <div className="form__element__image">
                        <img src={markerIcon} alt="icon" />
                      </div>
                      <div className="form__element__content">
                        <label htmlFor="eventAdd_map">
                          Zaznacz na mapie
                        </label>
                        <div
                          className="choose-location-buttons"
                          onClick={this.props.setAddMarkerMode}
                        >
                          Zaznacz na mapie
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form__element">
                      <div className="form__element__image">
                        <img src={searchIcon} alt="icon" />
                      </div>

                      <PlacesAutocomplete
                        value={this.state.eventAdd_address}
                        onChange={this.handleSelectChange}
                        onSelect={this.handleSelect}
                      >
                        {({
                          getInputProps,
                          suggestions,
                          getSuggestionItemProps,
                          loading
                        }) => (
                          <div className="map__search__container">
                            <label htmlFor="event_search_address">
                              Wyszukaj
                            </label>
                            <input
                              {...getInputProps({
                                placeholder: "Wpisz adres"
                                // className: "location-search-input",
                              })}
                              id="event_search_address"
                              name="event_search_address"
                            />
                            <div
                              className={
                                this.state.isSearchActive
                                  ? "search-item-container"
                                  : "search-item-container none"
                              }
                            >
                              {loading && <div>Loading...</div>}
                              {suggestions.map(suggestion => {
                                const className = suggestion.active
                                  ? "suggestion-item--active"
                                  : "suggestion-item";
                                return (
                                  <div
                                    {...getSuggestionItemProps(suggestion, {
                                      className
                                    })}
                                  >
                                    <span className="search-item">
                                      {suggestion.description}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </PlacesAutocomplete>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form__element">
                      <div className="form__element__button">
                        <button
                          className="choose-location-buttons"
                          type="submit"
                        >
                          Dodaj!
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

AddEvent.contextType = AppContext;

export default AddEvent;
