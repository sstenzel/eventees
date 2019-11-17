import React, { Component } from "react";
import $ from "jquery";
import Login from "./ProfileLogin";
import Register from "./ProfileRegister";
import Account from "./ProfileAccount";

import profileIcon from "./../../assets/icons/setting-lines.svg";

import { AppContext, AppConsumer } from "./../AppContext";

class Profile extends Component {
  state = {};

  handleChange = e => {
    const name = e.target.name;
    let value = e.target.value;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    if (e.target.type === "file") {
      value = e.target.files[0];
    }
    this.setState({ [name]: value });
  };

  handleChangeFile = (e) => {
    console.log(e.target.files[0])
    const name = e.target.name;
    let files = e.target.files;
    if(this.validateFile(files[0])){
      this.setState({ [name]: files[0] });
    }
  }

  printError = (inputName, errMsg) => {
    document.getElementById(inputName + "-error").innerHTML = errMsg;
  };

  validateFile = file => {
    return true;
  }

  validate = formName => {
    console.log(this.state);
    let isValid = true;

    let allErrorElements = document.querySelectorAll("." + formName + "-error");

    allErrorElements.forEach(errElement => {
      errElement.innerHTML = "";
    });

    const regexEmail = /\S+@\S+\.\S+/;

    Object.keys(this.state).forEach(inputName => {
      let inputForm = inputName.split("_")[0];
      let inputNameSplitted = inputName.split("_")[1];
      let inputValue = this.state[inputName];
      if (inputForm === formName) {
        switch (inputNameSplitted) {
          case "login":
            if (inputValue.length < 6) {
              this.printError(
                inputName,
                "Login musi zawierać co najmniej 6 znaków"
              );
              isValid = false;
            }
            break;
          case "password":
            if (inputValue.length < 8) {
              this.printError(
                inputName,
                "Hasło musi zawierać co najmniej 8 znaków"
              );
              isValid = false;
            }
            break;
          case "email":
            if (!regexEmail.test(inputValue)) {
              this.printError(inputName, "Podaj prawidłowy e-mail");
              isValid = false;
            }
            break;
          default:
            // console.log("");
        }

        if (inputName.split("_")[2]) {
          let inputSingleRepeat = document.getElementById(inputName);
          let inputSingle = document.getElementById(
            inputName.split("_")[0] + "_" + inputName.split("_")[1]
          );
          if (inputSingle.value !== inputSingleRepeat.value) {
            isValid = false;
            this.printError(inputName, "Podane hasła muszą być takie same");
          }
        }

        if (formName === "userRegister" && !this.state["userRegister_rodo"]) {
          this.printError("userRegister_rodo", "Zaakceptuj rodo");
          isValid = false;
        }
      }
    });
    return isValid;
  };

  handleSubmit = e => {
    e.preventDefault();
    const formName = e.target.name;

    if (this.validate(formName)) {
      if (formName === "userLogin") {
        this.context.login(e, this.state);
      } else if (formName === "userRegister") {
        this.switchForm('login');
        this.context.register(e, this.state);
      } else if(formName === "changePassword"){
        this.context.changePassword(e, this.state);
      } else if(formName === "changeEmail"){
        this.context.changeEmail(e, this.state);
      } else if(formName === "updateProfile"){
        this.context.update(e, this.state);
      } else if(formName === "userRemindPassword"){
        this.context.remindPassword(e, this.state);
      } else if(formName === "userConfirmRemindPassword"){
        this.context.recoverPassword(e, this.state);
      }
    }
  };

  onIconClick = () => {
    $(".map-section-profile").toggleClass("active");
  };

  switchForm = (formName) => {
    $(`.map-section-profile .${formName}`).slideDown();
    $(".map-section-profile .profile-form").not(`.${formName}`).slideUp();
  };

  render() {
    if(this.context.isActiveRecoverForm){
      this.switchForm('remindPassword-confirm');
    }
    return (
      <div className={`map-section map-section-profile ${this.context.isActiveRecoverForm ? "active" : ""}`}>
        <div className="map-section__inner">
          <div className="map-section__heading">
            <img
              className="map-section__heading__icon"
              src={profileIcon}
              alt="profile"
            />
            <h3>Profil</h3>
            <img
              onClick={this.onIconClick}
              src="/images/back.svg"
              alt="strzałka w lewo"
              className="back"
            />
          </div>
          <AppConsumer>
            {({
              isAuth,
              user,
              logout,
            }) => (
              <div className="map-section__content">
                {!isAuth ? (
                  <React.Fragment>
                    <Login
                      handleChange={this.handleChange}
                      handleSubmit={this.handleSubmit}
                      switchForm={this.switchForm}
                      remindPassword={this.remindPassword}
                    />
                    <Register
                      handleChange={this.handleChange}
                      handleSubmit={this.handleSubmit}
                      switchForm={this.switchForm}
                    />
                  </React.Fragment>
                ) : (
                  <Account
                    handleChange={this.handleChange}
                    handleChangeFile={this.handleChangeFile}
                    handleSubmit={this.handleSubmit}
                    logout={logout}
                    user={user}
                    formData={this.state}
                  />
                )}
              </div>
            )}
          </AppConsumer>
        </div>
      </div>
    );
  }
}

Profile.contextType = AppContext;

export default Profile;
