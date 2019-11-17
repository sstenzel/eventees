import React, { Component } from "react";
import Input from "./../form/Input";
import ButtonSubmit from "./../form/ButtonSubmit";

import passwordIcon from "./../../assets/icons/profile/padlock.svg";
import loginIcon from "./../../assets/icons/profile/user.svg";

class Login extends Component {
  render() {
    return (
      <>
        <div className="profile-form login">
        <h4 className="heading">Logowanie</h4>
        <form id="userLogin" name="userLogin" action="" onSubmit={this.props.handleSubmit}>
          <div className="row">
            <Input
              icon={loginIcon}
              title="Login"
              name="userLogin_login"
              placeholder="Wpisz login / e-mail"
              type="text"
              onChange={this.props.handleChange}
              required
            />
            <Input
              icon={passwordIcon}
              title="Hasło"
              name="userLogin_password"
              placeholder="Wpisz hasło"
              type="password"
              onChange={this.props.handleChange}
              required
            />
            <ButtonSubmit title="Login" name="userLogin_submit" />
            <p className="info">
              Zapomniałeś hasła?{" "}
              <span onClick={() => this.props.switchForm('remindPassword')}>Przypomnij hasło!</span>
            </p>
            <p className="info">
              Nie masz jeszcze konta?{" "}
              <span onClick={() => this.props.switchForm('register')}>Zarejestruj się!</span>
            </p>
          </div>
        </form>
      </div>
      <div className="profile-form remindPassword-confirm" style={{display:"none"}}>
        <h4 className="heading">Wpisz nowe hasło</h4>
        <form id="userConfirmRemindPassword" name="userConfirmRemindPassword" action="" onSubmit={this.props.handleSubmit}>
          <div className="row">
            <Input
              icon={passwordIcon}
              title="Hasło"
              name="userConfirmRemindPassword_password"
              placeholder="Wpisz nowe hasło"
              type="password"
              onChange={this.props.handleChange}
              required
            />
            <ButtonSubmit title="Zapisz hasło" name="userConfirmRemindPassword_submit" />
            <p className="info">
              Pamiętasz hasło?{" "}
              <span onClick={() => this.props.switchForm('login')}>Powrót do logowania!</span>
            </p>
          </div>
        </form>
      </div>
      <div className="profile-form remindPassword">
        <h4 className="heading">Przypomnij hasło</h4>
        <form id="userRemindPassword" name="userRemindPassword" action="" onSubmit={this.props.handleSubmit}>
          <div className="row">
            <Input
              icon={loginIcon}
              title="E-mail"
              name="userRemindPassword_email"
              placeholder="Wpisz e-mail"
              type="email"
              onChange={this.props.handleChange}
              required
            />
            <ButtonSubmit title="Przypomnij hasło" name="userRemindPassword_submit" />
            <p className="info">
              Masz już konto?{" "}
              <span onClick={() => this.props.switchForm('login')}>Zaloguj się!</span>
            </p>
            <p className="info">
              Nie masz jeszcze konta?{" "}
              <span onClick={() => this.props.switchForm('register')}>Zarejestruj się!</span>
            </p>
          </div>
        </form>
      </div>
      </>
    );
  }
}

export default Login;
