import React, { Component } from "react";
import Input from "../../form/Input";
import ButtonSubmit from "../../form/ButtonSubmit";

import peopleIcon from "./../../../assets/icons/filters/people.svg";
import calendarIcon from "./../../../assets/icons/filters/calendar.svg";
import timeIcon from "./../../../assets/icons/event/time.svg";
import nameIcon from "./../../../assets/icons/event/name.svg";
import descriptionIcon from "./../../../assets/icons/event/description.svg";

import { AppContext } from "../../AppContext";

class EventInfo extends Component {
  render() {
    return (
      <div className="map-section__content__element">
        <h4
          className="heading active"
          onClick={this.context.animateSectionElement}
        >
          Edytuj wydarzenie
        </h4>
        <div className="map-section-event__form">
          <form
            id="eventUpdate"
            name="eventUpdate"
            onSubmit={this.props.updateEvent}
          >
            <div className="row">
              <Input
                icon={nameIcon}
                title="Nazwa"
                name="eventUpdate_name"
                placeholder="Wpisz nazwę"
                type="text"
                onChange={this.props.handleChange}
                value={this.props.event.eventUpdate_name ? this.props.event.eventUpdate_name : this.props.event.name}
              />
              <Input
                icon={descriptionIcon}
                title="Opis"
                name="eventUpdate_description"
                placeholder="Wpisz opis"
                type="text"
                onChange={this.props.handleChange}
                value={this.props.event.eventUpdate_description ? this.props.event.eventUpdate_description : this.props.event.description}
              />
              <Input
                icon={calendarIcon}
                title="Data"
                name="eventUpdate_date"
                placeholder="Podaj datę"
                type="date"
                onChange={this.props.handleChange}
                value={this.props.event.eventUpdate_date ? this.props.event.eventUpdate_date : this.props.event.date}
              />
              <Input
                icon={timeIcon}
                title="Godzina"
                name="eventUpdate_time"
                placeholder="Podaj datę"
                type="time"
                onChange={this.props.handleChange}
                value={this.props.event.eventUpdate_time ? this.props.event.eventUpdate_time : this.props.event.time}
              />
              <Input
                icon={timeIcon}
                title="Ilość miejsc"
                name="eventUpdate_slots_all"
                placeholder="Wpisz ilość miejsc"
                type="number"
                onChange={this.props.handleChange}
                value={this.props.event.eventUpdate_slots_all ? this.props.event.eventUpdate_slots_all : this.props.event.slots_all}
              />
              <Input
                icon={peopleIcon}
                title="Ilość wolnych miejsc"
                name="eventUpdate_slots_available"
                placeholder="Wpisz ilość wolnych miejsc"
                type="number"
                onChange={this.props.handleChange}
                value={this.props.event.eventUpdate_slots_available ? this.props.event.eventUpdate_slots_available : this.props.event.slots_available}
              />
              <ButtonSubmit
                title="Zaktualizuj"
                name="eventUpdate_submit"
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

EventInfo.contextType = AppContext;

export default EventInfo;
