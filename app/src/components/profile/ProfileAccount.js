import React, { Component } from "react";
import $ from "jquery";
import Input from "./../form/Input";
import ButtonSubmit from "./../form/ButtonSubmit";

import loginIcon from "./../../assets/icons/profile/user.svg";

import { AppContext } from "./../AppContext";

class ProfileAccount extends Component {
  componentDidMount(){
    this.setState({})
  }

  toggleView = () => {
    $(".account__info").slideToggle();
    $(".account__edit").slideToggle();
  };

  showEditProfileForm = () => {
    $("form#updateProfile").slideDown();
    $("form#changeEmail").slideUp();
    $("form#changePassword").slideUp();
  };

  showChangeEmailForm = () => {
    $("form#updateProfile").slideUp();
    $("form#changeEmail").slideDown();
    $("form#changePassword").slideUp();
  };

  showChangePasswordForm = () => {
    $("form#updateProfile").slideUp();
    $("form#changeEmail").slideUp();
    $("form#changePassword").slideDown();
  };

  fileChangedHandler = event => {
    const file = event.target.files[0];
    this.setState({
      uploadedFile: event.target.files[0]
    });
    console.log(file);
  };

  uploadHandler = e => {
    console.log("upload");

    e.preventDefault();

    let postData = {
      avatar: this.state.uploadedFile,
      elo320: this.state.uploadedFile.name
    };

    console.log(postData);
    fetch("http://localhost:8000/postTest", {
      method: "post",
      // headers: {
      //   "Content-Type": "multipart/form-data"
      // },
      body: JSON.stringify(postData)
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        this.context.showInfo(false);
      });
  };

  render() {
    return (
      <div className="account">
        <div className="account__info">
          <div className="account__image">
            <img
              src={`http://localhost:8000/uploads/images/${this.props.user.avatar_path.split("/").slice(-1)[0]}`}
              alt="avatar"
            />
          </div>
          <h5>
            {this.props.user.first_name} {this.props.user.last_name}
          </h5>
          <p>{this.props.user.description}</p>
          <table className="table-informations">
            <tbody>
              <tr>
                <td>
                  <h6>Login:</h6>
                </td>
                <td>{this.context.user.login}</td>
              </tr>
              <tr>
                <td>
                  <h6>Data urodzenia:</h6>
                </td>
                <td>
                  {this.context.user.birth ? (
                    this.context.user.birth
                  ) : (
                    <span>nie podano</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <h6>Płeć:</h6>
                </td>
                <td>
                  {this.context.user.sex ? (
                    this.context.user.sex === 'male' ? "Mężczyzna" : "Kobieta"
                  ) : (
                    <span>nie podano</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <h6>Miasto:</h6>
                </td>
                <td>
                  {this.context.user.city ? (
                    this.context.user.city
                  ) : (
                    <span>nie podano</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="button__outer">
            <button
              name="userEditProfile"
              onClick={e => {
                this.toggleView();
                this.showEditProfileForm();
              }}
            >
              Edytuj profil
            </button>
          </div>
          <div className="button__outer">
            <button name="userLogout" onClick={this.props.logout}>
              Wyloguj
            </button>
          </div>
        </div>
        <div className="account__edit">
          <h4 className="heading">Edycja profilu</h4>
          <form
            id="updateProfile"
            name="updateProfile"
            action=""
            onSubmit={this.props.handleSubmit}
            encType="multipart/form-data"
          >
            <div className="row">
              <Input
                icon={loginIcon}
                title="Imię"
                name="userEdit_first_name"
                placeholder="Wpisz imię"
                value={
                  this.props.formData.userEdit_first_name
                    ? this.props.formData.userEdit_first_name
                    : this.props.user.first_name ? this.props.user.first_name : ""
                }
                type="text"
                onChange={this.props.handleChange}
              />
              <Input
                icon={loginIcon}
                title="Nazwisko"
                name="userEdit_last_name"
                placeholder="Wpisz nazwisko"
                value={
                  this.props.formData.userEdit_last_name
                    ? this.props.formData.userEdit_last_name
                    : this.props.user.last_name ? this.props.user.last_name : ""
                }
                type="text"
                onChange={this.props.handleChange}
              />
              <div className="col-12">
                <div className="form__element">
                  <div className="form__element__image">
                    <img src={loginIcon} alt="icon" />
                  </div>
                  <div className="form__element__content">
                    <label htmlFor="userEdit_sex">Płeć</label>
                    <div className="custom-dropdown">
                      <select
                        name="userEdit_sex"
                        onChange={this.props.handleChange}
                        value={
                          this.props.formData.userEdit_sex
                            ? this.props.formData.userEdit_sex
                            : this.props.user.sex ? this.props.user.sex : ""
                        }
                      >
                        <option value="male">Mężczyzna</option>
                              <option value="female">Kobieta</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <Input
                icon={loginIcon}
                title="Data urodzenia"
                name="userEdit_birth"
                placeholder="Podaj datę urodzenia"
                value={
                  this.props.formData.userEdit_birth
                    ? this.props.formData.userEdit_birth
                    : this.props.user.birth ? this.props.user.birth : ""
                }
                type="date"
                onChange={this.props.handleChange}
              />
              <Input
                icon={loginIcon}
                title="Miasto"
                name="userEdit_city"
                placeholder="Wpisz nazwę miasta"
                value={
                  this.props.formData.userEdit_city
                    ? this.props.formData.userEdit_city
                    : this.props.user.city ? this.props.user.city : ""
                }
                type="text"
                onChange={this.props.handleChange}
              />
              <Input
                icon={loginIcon}
                title="Avatar"
                name="userEdit_avatar"
                placeholder="Zdjęcie"
                value={""}
                type="file"
                onChange={this.props.handleChangeFile}
              />
              <ButtonSubmit
                title="Zapisz zmiany"
                name="userEdit"
              />
            </div>
          </form>
          <form
            id="changeEmail"
            name="changeEmail"
            action=""
            onSubmit={this.props.handleSubmit}
          >
            <div className="row">
              <Input
                icon={loginIcon}
                title="E-mail"
                name="userEdit_email_new"
                placeholder="Nowy e-mail"
                type="email"
                onChange={this.props.handleChange}
              />
              <Input
                icon={loginIcon}
                title="E-mail"
                name="userEdit_email_new_repeat"
                placeholder="Powtórz nowy e-mail"
                type="email"
                onChange={this.props.handleChange}
              />
              <Input
                icon={loginIcon}
                title="Hasło"
                name="userEdit_password"
                placeholder="Twoje hasło"
                type="password"
                onChange={this.props.handleChange}
              />
              <ButtonSubmit
                title="Zapisz zmiany"
                name="userEdit_changeEmail"
              />
            </div>
          </form>
          <form
            id="changePassword"
            name="changePassword"
            action=""
            onSubmit={this.props.handleSubmit}
          >
            <div className="row">
              <Input
                icon={loginIcon}
                title="Nowe hasło"
                name="userEdit_password_new"
                placeholder="Nowe hasło"
                type="password"
                onChange={this.props.handleChange}
              />
              <Input
                icon={loginIcon}
                title="Nowe hasło"
                name="userEdit_password_new_repeat"
                placeholder="Powtórz nowe hasło"
                type="password"
                onChange={this.props.handleChange}
              />
              <Input
                icon={loginIcon}
                title="Hasło"
                name="userEdit_password_old"
                placeholder="Twoje hasło"
                type="password"
                onChange={this.props.handleChange}
              />
              <ButtonSubmit
                title="Zapisz zmiany"
                name="userEdit_changePassword"
              />
            </div>
          </form>
          <div className="button-group">
            <div className="button__outer">
              <button
                name="userShowProfile"
                id="userShowProfile"
                onClick={this.toggleView}
              >
                Zobacz swój profil
              </button>
            </div>
            <div className="button__outer">
              <button
                name="userChangeEmail"
                id="userChangeEmail"
                onClick={this.showChangeEmailForm}
              >
                Zmień e-mail
              </button>
            </div>
            <div className="button__outer">
              <button
                name="userChangePassword"
                id="userChangePassword"
                onClick={this.showChangePasswordForm}
              >
                Zmień hasło
              </button>
            </div>
            <div className="button__outer">
              <button name="userLogout" onClick={this.props.logout}>
                Wyloguj
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileAccount.contextType = AppContext;

export default ProfileAccount;
