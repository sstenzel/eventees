import React, { Component } from "react";
import Input from "./../form/Input";
import InputCheckbox from "./../form/InputCheckbox";
import ButtonSubmit from "./../form/ButtonSubmit";

import passwordIcon from "./../../assets/icons/profile/padlock.svg";
import loginIcon from "./../../assets/icons/profile/user.svg";
import emailIcon from "./../../assets/icons/profile/email.svg";

class Register extends Component {
  render() {
    return (
      <div className="profile-form register">
        <h4 className="heading">Rejestracja</h4>
        <form id="userRegister" name="userRegister" action="" onSubmit={this.props.handleSubmit}>
          <div className="row">
            <Input
              icon={loginIcon}
              title="Login"
              name="userRegister_login"
              placeholder="Wpisz nazwę użytkownika"
              type="text"
              onChange={this.props.handleChange}
              required
            />
            <Input
              icon={emailIcon}
              title="E-mail"
              name="userRegister_email"
              placeholder="Wpisz e-mail"
              type="email"
              onChange={this.props.handleChange}
              pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
              required
            />
            <Input
              icon={passwordIcon}
              title="Hasło"
              name="userRegister_password"
              placeholder="Wpisz hasło"
              type="password"
              onChange={this.props.handleChange}
              required
            />
            <Input
              icon={passwordIcon}
              title="Powtórz hasło"
              name="userRegister_password_repeat"
              placeholder="Powtórz hasło"
              type="password"
              onChange={this.props.handleChange}
              required
            />
            <InputCheckbox
              icon={passwordIcon}
              title="Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z ustawą o ochronie danych osobowych w celu (np. wysyłania informacji handlowej). Podanie danych osobowych jest dobrowolne. Zostałem poinformowany, że przysługuje mi prawo dostępu do swoich danych. Administratorem danych jest Eventees<eventees12@gmail.com>"
              name="userRegister_rodo"
              type="checkbox"
              onChange={this.props.handleChange}
            />
            <ButtonSubmit
              title="Rejestracja"
              name="userRegister_submit"
            />
            <p className="info">
              Masz już konto?{" "}
              <span onClick={() => this.props.switchForm('login')}>Zaloguj się!</span>
            </p>
          </div>
        </form>
      </div>
    );
  }
}

export default Register;
