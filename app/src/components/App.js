import React, { Component } from "react";

import Navigation from "./navigation/Navigation";
import Map from "./map/Map";
import WelcomeScreen from "./popup/WelcomeScreen";
import Popup from "./popup/Popup";
import Cookies from "./popup/Cookies";
import AdminPanel from "./administration/AdminPanel";

import { AppProvider, AppConsumer } from "./AppContext";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdminPanel: false
    };
  }

  getAllEvents = () => {
    this.map.getAllEvents();
  };

  getUserEvents = () => {
    this.map.getUserEvents();
  };

  onAdminClick = () => {
    this.setState({ showAdminPanel: !this.state.showAdminPanel });
  };

  render() {
    const userHasVisited = document.cookie ? true : false;
    if (!userHasVisited) {
      document.cookie = "hasVisited=true";
    }
    return (
      <AppProvider>
        <>
          <div className="app">
            <div className="app__content row">
              <div className="app__navigation col-1">
                <Navigation
                  onMapIconClick={this.getAllEvents}
                  onMyEventsClick={this.getUserEvents}
                  onAdminClick={this.onAdminClick}
                  activeAdminPanel={this.state.showAdminPanel}
                />
              </div>
              <AppConsumer>
                {context =>
                  context.isAdmin ? (
                    <>
                      {this.state.showAdminPanel ? (
                        <div className="app__admin col-11">
                          <AdminPanel />
                        </div>
                      ) : (
                        <div className="app__map  col-11">
                          <Map onRef={ref => (this.map = ref)} />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="app__map col-11">
                      <Map onRef={ref => (this.map = ref)} />
                    </div>
                  )
                }
              </AppConsumer>
            </div>
          </div>
          {!userHasVisited ? (
            <>
              <WelcomeScreen />
              <Cookies />
            </>
          ) : (
            <></>
          )}
          <AppConsumer>
            {context => (!context.isAuth ? <Popup type="login" /> : "")}
          </AppConsumer>
          <Popup type="error" />
          <Popup type="success" />
        </>
      </AppProvider>
    );
  }
}

export default App;
