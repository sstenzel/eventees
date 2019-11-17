import React from "react";
import $ from "jquery";

function Cookies() {
  const hideCookies = () => {
    $(".cookies").fadeOut();
  };
  return (
    <div className="cookies">
      <div className="cookies__inner">
        <p>
          Nasza strona używa ciasteczek. Korzystając ze strony akceptujesz
          politykę plików cookies.
        </p>
        <button className="cookies__button" onClick={hideCookies}>
          Rozumiem
        </button>
      </div>
    </div>
  );
}

export default Cookies;
