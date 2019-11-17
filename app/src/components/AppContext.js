import React from "react";
import $ from "jquery";

const AppContext = React.createContext();

const API_USER = "http://localhost:8000/user";

class AppProvider extends React.Component {
  state = {
    app: "react",
    isAuth: false,
    isAdmin: JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user")).role_id === 1
        ? true
        : false
      : false,
    token: localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user")),
    userParticipations: JSON.parse(localStorage.getItem("userParticipations")),
    userEvents: JSON.parse(localStorage.getItem("userEvents")),
    theme: "light",
    isActiveRecoverForm: false
  };

  async componentDidMount() {
    console.log(this.state);
    this.checkAppUrl();
    if (this.state.token) {
      this.getUser();
      this.getUserEvents();
      this.getUserParticipations();
    }
  }

  getUser = () => {
    fetch(`${API_USER}/logged`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        api_token: localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(res => {
        localStorage.setItem("user", JSON.stringify(res));
        this.setState({
          isAuth: true,
          isAdmin: res.role_id === 1,
          token: localStorage.getItem("token"),
          user: res
        });
      })
      .catch(err => {
        console.log(err);
        this.logout();
      });
  };

  getUserEvents = async () => {
    console.log("getUserEvents()");

    await fetch(`${API_USER}/events`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        api_token: localStorage.getItem("token")
      }
    })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem("userEvents", JSON.stringify(data));
        this.setState({ userEvents: data });
      })
      .catch(err => console.log(err));

    //console.log(this.state.userEvents);
  };

  getUserParticipations = async () => {
    console.log("getUserParticipations()");

    await fetch(`${API_USER}/participations`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        api_token: localStorage.getItem("token")
      }
    })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem("userParticipations", JSON.stringify(data));
        this.setState({ userParticipations: data });
      })
      .catch(err => console.log(err));

    //console.log(this.state.userParticipations);
  };

  login = (e, formData) => {
    e.preventDefault();

    let postData = {
      password: formData.userLogin_password
    };

    var regex = /\S+@\S+\.\S+/;
    if (regex.test(formData.userLogin_login)) {
      postData.email = formData.userLogin_login;
    } else {
      postData.login = formData.userLogin_login;
    }

    console.log(postData);
    fetch(`${API_USER}/login`, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.status === "OK") {
          localStorage.setItem("token", res.token);
          this.getUser();
          this.getUserEvents();
          this.getUserParticipations();
        } else {
          if (res.Error === "Email not confirmed") {
            this.showInfo(
              false,
              "Musisz potwierdzić adres e-mail. Sprawdź swoją skrzynkę pocztową."
            );
          } else if (res.Error === "Account blocked") {
            this.showInfo(false, "Konto zostało zablokowane");
          } else {
            this.showInfo(false, "Wpisz poprawne dane");
          }
        }
      })
      .catch(err => {
        console.log(err);
        this.showInfo(false);
      });
  };

  register = (e, formData) => {
    e.preventDefault();
    let postData = {
      login: formData.userRegister_login,
      email: formData.userRegister_email,
      password: formData.userRegister_password
    };
    console.log(postData);
    fetch(API_USER, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.status === "OK") {
          this.showInfo(
            true,
            "Aby zakończyć proces rejestracji musisz potwierdzić adres e-mail."
          );
        } else {
          if (
            res.Error["Database exception"].errorInfo[2].includes(
              "user_login_unique"
            )
          ) {
            this.showInfo(false, "Użytkownik z podanym loginem już istnieje");
          } else if (
            res.Error["Database exception"].errorInfo[2].includes(
              "user_email_unique"
            )
          ) {
            this.showInfo(
              false,
              "Użytkownik z podanym adresem e-mail już istnieje"
            );
          } else {
            this.showInfo(false);
          }
        }
      })
      .catch(err => {
        console.log(err);
        this.showInfo(false);
      });
  };

  update = (e, formData) => {
    e.preventDefault();

    let postData = new FormData();

    for (let key of Object.keys(formData)) {
      if (key.includes("userEdit")) {
        postData.append(key.replace("userEdit_", ""), formData[key]);
      }
    }

    console.log(postData);
    fetch(`${API_USER + "/update"}`, {
      method: "post",
      headers: {
        api_token: localStorage.getItem("token")
      },
      body: postData
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.status === "OK") {
          this.getUser();
          $(".account__info").slideToggle();
          $(".account__edit").slideToggle();
        } else{
          this.showInfo(false);
        }
      })
      .catch(err => {
        console.log(err);
        this.showInfo(false);
      });
  };

  logout = () => {
    localStorage.clear();
    this.setState(
      {
        isAuth: false,
        isAdmin: false,
        token: localStorage.getItem("token"),
        user: JSON.parse(localStorage.getItem("user")),
        userParticipations: JSON.parse(
          localStorage.getItem("userParticipations")
        ),
        userEvents: JSON.parse(localStorage.getItem("userEvents"))
      },
      () => this.forceUpdate()
    );
  };

  changePassword = (e, formData) => {
    e.preventDefault();
    console.log("changePassword");

    let postData = {
      newPassword: formData["userEdit_password_new"],
      // newPasswordConfirmation: formData["userEdit_password_new_repeat"],
      password: formData["userEdit_password_old"]
    };

    console.log(postData);
    fetch(`${API_USER + "/updatePassword"}`, {
      method: "put",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        api_token: localStorage.getItem("token")
      },
      body: JSON.stringify(postData)
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.status === "OK") {
          // this.getUser();
          
          this.logout();
          this.showInfo(true,
            "Zostałeś wylogowany ;/ <br/>Aby ponownie zacząć korzystać z aplikacji wprowadź swoje nowe dane logowania. :)"
          );
        } else{
          this.showInfo(false, "Wystąpił błąd. :( <br/>Sprawdź poprawność wpisanych danych");
        }
      });
  };

  changeEmail = (e, formData) => {
    e.preventDefault();
    console.log("changeEmail");

    let postData = {
      email: formData["userEdit_email_new"],
      // emailConfirmation: formData["userEdit_email_new_repeat"],
      password: formData["userEdit_password"]
    };

    console.log(postData);
    fetch(`${API_USER + "/updateEmail"}`, {
      method: "put",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        api_token: localStorage.getItem("token")
      },
      body: JSON.stringify(postData)
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.status === "OK") {
          this.showInfo(
            true,
            "Aby potwierdzić zmiane adresu e-mail kliknij w link wysłany na podany adres e-mail."
          );
        } else{
          this.showInfo(false, "Wystąpił błąd. :( Sprawdź poprawność wpisanych danych");
        }
      })
      .catch(err => {
        console.log(err);
        this.showInfo(false);
      });
  };

  changeTheme = async () => {
    const { theme: currentTheme } = this.state;
    switch (currentTheme) {
      case "light":
        return await this.setState({ theme: "dark" });
      case "dark":
        return await this.setState({ theme: "light" });
      default:
        return null;
    }
  };

  hideAllSections = () => {
    $(".map-section").removeClass("active");
    $(".map-search").removeClass("active");
  };

  toggleShowSection = sectionClass => {
    const section = $(sectionClass);
    if (section.hasClass("active")) {
      section.removeClass("active");
    } else {
      this.hideAllSections();
      section.addClass("active");
    }
  };

  toggleShowPopup = popupType => {
    this.hideAllSections();
    $(".popup--" + popupType).fadeToggle();
  };

  showInfo = (isGood, msg) => {
    //this.hideAllSections();
    if (isGood) {
      if (msg) {
        $(".popup--success")
          .find("p")
          .html(msg);
      }
      $(".popup--success").fadeIn();
    } else {
      if (msg) {
        $(".popup--error")
          .find("p")
          .html(msg);
      }
      $(".popup--error").fadeIn();
    }
  };

  animateSectionElement(e) {
    console.log("animate");
    $(e.target)
      .parent()
      .children("div")
      .slideToggle();
    $(e.target)
      .parent()
      .toggleClass("folded");
  }

  checkAppUrl = () => {
    const [homeUrl, parameters] = window.location.href.split("?");
    if (parameters) {
      let [method, hashedId] = parameters.split("&");
      method = method.split("=")[0];
      console.log(method, hashedId);

      if (method === "register") {
        this.confirmEmailRegister(hashedId);
        window.history.pushState(null, null, homeUrl);
      }
      else if (method === "mail_update") {
        this.confirmNewEmail(hashedId);
        window.history.pushState(null, null, homeUrl);
      }
      else if (method === "recover_password")
        this.showRecoverPasswordForm();

    }
  };

  confirmEmailRegister = hashedId => {
    fetch(`${API_USER}/confirmEmail`, {
      method: "put",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        hashedId: hashedId
      })
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.status === "OK") {
          this.showInfo(
            true,
            "Brawo! Potwierdziłeś adres e-mail. Teraz możesz się zalogować :)"
          );
        }
      })
      .catch(err => {
        console.log(err);
        this.showInfo(false);
      });
  };

  confirmNewEmail = hashedId => {
    fetch(`${API_USER}/confirmNewEmail`, {
      method: "put",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        hashedId: hashedId
      })
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.status === "OK") {
          this.logout();
          this.showInfo(true, "Brawo! Zaaktualizowałeś swój adres e-mail :)");
        }
      })
      .catch(() => this.showInfo(false));
  };

  remindPassword = (e, formData) => {
    e.preventDefault();

    fetch(`${API_USER}/sendRecoverPassword`, {
      method: "put",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: formData.userRemindPassword_email })
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.status === "OK") {
          this.showInfo(
            true,
            "Na twój e-mail został wysłana wiadomość z linkiem"
          );
        } else {
          this.showInfo(
            false,
            "Coś poszło nie tak. Sprawdź wpisane dane w formularzu."
          );
        }
      })
      .catch(err => {
        console.log(err);
        this.showInfo(false);
      });
  };

  showRecoverPasswordForm = () => {
    console.log("showRecoverPasswordForm");
    console.log(window.location.href.split("?")[1].split("&")[1]);
    this.setState({isActiveRecoverForm: true});
  }

  recoverPassword = (e, formData) => {
    let postData = {
      hashedId: window.location.href.split("?")[1].split("&")[1],
      newPassword: formData.userConfirmRemindPassword_password
    }
    console.log(postData);
    fetch(`${API_USER}/recoverPassword`, {
      method: "put",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        window.history.pushState(null, null, window.location.href.split("?")[0]);
        this.setState({isActiveRecoverForm: false}, () => this.forceUpdate());
        $('.remindPassword-confirm').css('display','none');
        $(`.map-section-profile .login`).slideDown();
        if (res.status === "OK") {
          this.showInfo(true, "Brawo! Zmieniłeś hasło :)");
        }
      })
      .catch(err => {
        console.log(err);
        this.showInfo(false);
      });
  };

  render() {
    return (
      <AppContext.Provider
        value={{
          app: this.state.app,
          isAuth: this.state.isAuth,
          isAdmin: this.state.isAdmin,
          token: this.state.token,
          user: this.state.user,
          userEvents: this.state.userEvents,
          userParticipations: this.state.userParticipations,
          isActiveRecoverForm: this.state.isActiveRecoverForm,
          login: this.login,
          remindPassword: this.remindPassword,
          recoverPassword: this.recoverPassword,
          register: this.register,
          logout: this.logout,
          update: this.update,
          getUserEvents: this.getUserEvents,
          getUserParticipations: this.getUserParticipations,
          changeEmail: this.changeEmail,
          changePassword: this.changePassword,
          theme: this.state.theme,
          changeTheme: this.changeTheme,
          hideAllSections: this.hideAllSections,
          toggleShowSection: this.toggleShowSection,
          toggleShowPopup: this.toggleShowPopup,
          showInfo: this.showInfo,
          animateSectionElement: this.animateSectionElement,
          checkAppUrl: this.checkAppUrl,
        }}
      >
        {/* <AuthProvider>
          <ThemeProvider> */}
        {this.props.children}
        {/* </ThemeProvider>
        </AuthProvider> */}
      </AppContext.Provider>
    );
  }
}

const AppConsumer = AppContext.Consumer;

export { AppConsumer, AppProvider, AppContext };
