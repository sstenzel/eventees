import React, { Component } from "react";
import $ from "jquery";

import NavigationItem from "./NavigationItem.js";
import { AppContext } from "./../AppContext";

import userIcon from "./../../assets/icons/user.svg";
import placeholderIcon from "./../../assets/icons/placeholder-outline.svg";
import invitationIcon from "./../../assets/icons/invitation.svg";
import mapIcon from "./../../assets/icons/map.png";
import settingsIcon from "./../../assets/icons/cogwheel-outline.svg";

class Navigation extends Component {
  setActiveNavItem = e => {
    $(".navigation__menu ul li").removeClass("active");
    e.currentTarget.classList.add("active");
  };

  onMapIconClick = e => {
    this.props.onMapIconClick();
    this.setActiveNavItem(e);
    this.context.hideAllSections();
  };

  onMyEventsClick = e => {
    if (this.context.isAuth) {
      this.props.onMyEventsClick();
      this.context.toggleShowSection(".map-section-myevents");
      this.setActiveNavItem(e);
    } else {
      this.context.toggleShowPopup("login");
    }
  };

  onProfileClick = e => {
    this.context.toggleShowSection(".map-section-profile");
    this.setActiveNavItem(e);
  };

  onInvitationsClick = e => {
    if (this.context.isAuth) {
      this.context.toggleShowSection(".map-section-invitations");
      this.setActiveNavItem(e);
    } else {
      this.context.toggleShowPopup("login");
    }
  };

  onAdminClick = e => {
    this.props.onAdminClick();
    this.setActiveNavItem(e);
    this.context.hideAllSections();
  };

  render() {
    return (
      <div className="navigation">
        <div className="navigation__content">
          <div className="title">
            <h1>Eventees</h1>
          </div>
          <div className="navigation__menu">
            <ul>
              {!this.props.activeAdminPanel ? (
                <>
                  <NavigationItem
                    isActive
                    onNavItemClick={this.onMapIconClick}
                    content="Mapa"
                    icon={mapIcon}
                    iconAlt="Map icon"
                  />

                  {this.context.isAuth ? (
                    <>
                      <NavigationItem
                        onNavItemClick={this.onMyEventsClick}
                        content="Moje eventy"
                        icon={placeholderIcon}
                        iconAlt="Marker icon"
                      />
                      <NavigationItem
                        onNavItemClick={this.onInvitationsClick}
                        content="Zaproszenia"
                        icon={invitationIcon}
                        iconAlt="Marker icon"
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <>
                  <NavigationItem
                    onNavItemClick={this.onAdminClick}
                    content="Mapa"
                    icon={mapIcon}
                    iconAlt="Map icon"
                  />
                </>
              )}
            </ul>
            <ul>
              {!this.props.activeAdminPanel ? (
                <>
                  <NavigationItem
                    onNavItemClick={this.onProfileClick}
                    content="Profil"
                    icon={userIcon}
                    iconAlt="Profile"
                  />
                  {this.context.isAdmin ? (
                    <NavigationItem
                      onNavItemClick={this.onAdminClick}
                      content="Admin"
                      icon={settingsIcon}
                      iconAlt="Admin"
                    />
                  ) : (
                    <></>
                  )}
                  <li className="toggle__button">
                    <div className="display">
                      <label className="label toggle">
                        <input
                          type="checkbox"
                          className={`toggle_input ${this.context.theme}`}
                          onChange={this.context.changeTheme}
                        />
                        <div className="toggle-control" />
                      </label>
                    </div>
                  </li>
                </>
              ) : (
                <></>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

Navigation.contextType = AppContext;

export default Navigation;
