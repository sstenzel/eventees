import React, { Component } from "react";
import $ from "jquery";

import Input from "./../../form/Input";
import InputRange from "./../../form/InputRange";
import FilterCategories from "./FiltersCategories";

import filtersIcon from "./../../../assets/icons/setting-lines.svg";
import peopleIcon from "./../../../assets/icons/filters/people.svg";
import calendarIcon from "./../../../assets/icons/filters/calendar.svg";
import nameIcon from "./../../../assets/icons/event/name.svg";

import { AppContext } from "./../../AppContext";

class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slots_available_from: null,
      slots_available_to: null,
      slots_all_from: null,
      slots_all_to: null,
      name: null,
      date_from: null,
      date_to: null,
      category_id: null
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onIconClick = () => {
    this.context.hideAllSections();
    $(".map-section-filters").toggleClass("active");
  };

  onArrowClick = () => {
    $(".map-section-filters").removeClass("active");
  };

  filter = () => {
    this.props.filterPoints(this.state);
  };

  onSportCategoryIconClick = id => {
    this.setState({ category_id: this.state.category_id === id ? null : id });
  };

  render() {
    return (
      <div className="map-section map-section-filters">
        <div
          className="map__icon map-section-filters__icon"
          onClick={this.onIconClick}
        >
          <img src={filtersIcon} alt="filters" />
        </div>
        <div className="map-section__inner">
          <div className="map-section__heading">
            <img
              className="map-section__heading__icon"
              src={filtersIcon}
              alt="filters"
            />
            <h3>Filtry</h3>
            <img
              onClick={this.onArrowClick}
              src="/images/back.svg"
              alt="strzałka w lewo"
              className="back"
            />
          </div>
          <div className="map-section__content">
            <form action="">
              <div className="row">
                <Input
                  icon={nameIcon}
                  title="Nazwa"
                  name="name"
                  placeholder="Wpisz nazwę"
                  type="text"
                  onChange={this.handleChange}
                />
                <InputRange
                  icon={calendarIcon}
                  title="Data"
                  nameFrom="date_from"
                  nameTo="date_to"
                  placeholderFrom="Wybierz datę"
                  placeholderTo="Wybierz datę"
                  type="date"
                  onChange={this.handleChange}
                />
                <InputRange
                  icon={peopleIcon}
                  title="Ilość wolnych miejsc"
                  nameFrom="slots_available_from"
                  nameTo="slots_available_to"
                  placeholderFrom="Od"
                  placeholderTo="Do"
                  type="text"
                  onChange={this.handleChange}
                />
                <InputRange
                  icon={peopleIcon}
                  title="Ilość wszystkich miejsc"
                  nameFrom="slots_all_from"
                  nameTo="slots_all_to"
                  placeholderFrom="Od"
                  placeholderTo="Do"
                  type="text"
                  onChange={this.handleChange}
                />
                <FilterCategories onIconClick={this.onSportCategoryIconClick} />
              </div>
            </form>
          </div>
          <div className="map-section__button">
            <button type="button" onClick={this.filter}>
              Pokaż wydarzenia
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Filters.contextType = AppContext;

export default Filters;
