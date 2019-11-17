import React, { Component } from "react";
import $ from "jquery";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

import searchIcon from "./../../assets/icons/search.svg";

import { AppContext } from "./../AppContext";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: ""
    };
  }

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(position => {
        // console.log("Success", position);
        this.props.setMapZoom(12);
        this.props.recenterMap(position);
      })
      .catch(error => console.error("Error", error));
      this.context.hideAllSections();
  };

  onIconClick = () => {
    $('.map-search').toggleClass('active');
  }

  render() {
    // const searchOptions = {
    //   location: new this.props.google.maps.LatLng(54.4446674, 18.5685868),
    //   radius: 20000,
    //   types: ['address']
    // }
    return (
      <div className="map-search">
        <div
          className="map__icon map-search__icon"
          onClick={this.onIconClick}
        >
          <img src={searchIcon} alt="search" />
        </div>
        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          // searchOptions={searchOptions}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading
          }) => (
            <div className="map-search__inner">
              <input
                {...getInputProps({
                  placeholder: "Wyszukaj...",
                  className: "location-search-input"
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div className="suggestion-item"><span>Szukam...</span></div>}
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
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
    );
  }
}

Search.contextType = AppContext;

export default Search;
