import React, { Component } from "react";

import { AppContext } from "./../../AppContext";

class EventInfo extends Component {
  render() {
    return (
      <div className="map-section__content__element">
        <h4
          className="heading active"
          onClick={this.context.animateSectionElement}
        >
          Informacje o wydarzeniu
        </h4>
        <div className="map-section-event__informations">
          <table className="table-informations">
            <tbody>
              <tr>
                <td>
                  <h6>Nazwa:</h6>
                </td>
                <td>{this.props.event.name}</td>
              </tr>
              <tr>
                <td>
                  <h6>Ilość miejsc:</h6>
                </td>
                <td>
                  {this.props.event.slots_available} /{" "}
                  {this.props.event.slots_all}
                </td>
              </tr>
              <tr>
                <td>
                  <h6>Miejsce:</h6>
                </td>
                <td>{this.props.event.adress_description}</td>
              </tr>
              <tr>
                <td>
                  <h6>Kategoria:</h6>
                </td>
                <td>{this.props.event.category_name}</td>
              </tr>
              <tr>
                <td>
                  <h6>Data:</h6>
                </td>
                <td>
                  {this.props.event.date} o {this.props.event.time}
                </td>
              </tr>
              <tr>
                <td>
                  <h6>Autor:</h6>
                </td>
                <td>{this.props.event.author.login}</td>
              </tr>
            </tbody>
          </table>
          {this.context.isAuth ? (
            this.props.eventParticipants ? (
              <div className="map-section-event__participants">
                {this.props.eventParticipants.map((participant, index) => (
                  <div className="single-participant" key={index}>
                    <img
                      src={`http://localhost:8000/uploads/images/${participant.avatar_path.split("/").slice(-1)[0]}`}
                      title={participant.login}
                      alt="uczestnik ikona"
                    />
                    {this.context.isAdmin || this.props.userIsCreator ? (
                      <div className="single-participant__delete" onClick={() => this.props.removeParticipant(participant.id)}>x</div>
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <React.Fragment />
            )
          ) : (
            <React.Fragment />
          )}
        </div>
      </div>
    );
  }
}

EventInfo.contextType = AppContext;

export default EventInfo;
