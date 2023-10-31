import { useState } from "react";
import "./sign-up-login.css";

function SignUpLogin() {
  const initialValueSignUp = {
    pseudo: "",
    mail: "",
    password: "",
  };
  const initialValueLogin = {
    mail: "",
    password: "",
  };
  const [formValuesSignUp, setInputesValuesSignUp] =
    useState(initialValueSignUp);
  const [formValuesLogin, setInputesValuesLogin] = useState(initialValueLogin);
  const [onSignUp, setOnSignUp] = useState(true);

  function handleChangeSignUp(e) {
    setInputesValuesSignUp({
      ...formValuesSignUp,
      [e.target.name]: e.target.value,
    });
  }

  function handleChangeLogin(e) {
    setInputesValuesLogin({
      ...formValuesLogin,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmitSignUp(e) {
    e.preventDefault();
    console.log("SignUp:");
    console.log(formValuesSignUp);
  }

  function handleSubmitLogin(e) {
    e.preventDefault();
    console.log("Login:");
    console.log(formValuesLogin);
  }

  function changement() {
    setOnSignUp(!onSignUp);
  }

  return (
    <>
      <div className="container-all">
        <div className={onSignUp ? "wrapper" : "wrapper active"}>
          <div className="form signup">
            <header onClick={changement}>Signup</header>
            <form onSubmit={(e) => handleSubmitSignUp(e)}>
              <div className="form-row">
                <div className="input-data">
                  <input
                    type="text"
                    name="pseudo"
                    value={formValuesSignUp.pseudo}
                    onChange={handleChangeSignUp}
                    required
                  />
                  <div className="underline"></div>
                  <label >Pseudo</label>
                </div>
              </div>
              <div className="form-row">
                <div className="input-data mail">
                  <input
                    type="mail"
                    name="mail"
                    value={formValuesSignUp.mail}
                    onChange={handleChangeSignUp}
                    required
                  />
                  <div className="underline"></div>
                  <label >Mail</label>
                </div>
              </div>
              <div className="form-row">
                <div className="input-data">
                  <input
                    type="password"
                    name="password"
                    value={formValuesSignUp.password}
                    onChange={handleChangeSignUp}
                    required
                  />
                  <div className="underline"></div>
                  <label >Mot de passe</label>
                </div>
              </div>
              <br></br>
              <div className="center-button">
                <button type="submit" className="submit-button">
                  Valider
                </button>
              </div>
            </form>
          </div>

          <div className="form login">
            <header onClick={changement}>Login</header>
            <br/>
            <form onSubmit={(e) => handleSubmitLogin(e)}>
              <div className="form-row">
                <div className="input-data">
                  <input
                    type="mail"
                    name="mail"
                    value={formValuesLogin.mail}
                    onChange={handleChangeLogin}
                    required
                  />
                  <div className="underline"></div>
                  <label >Mail</label>
                </div>
              </div>
              <div className="form-row">
                <div className="input-data">
                  <input
                    type="password"
                    name="password"
                    value={formValuesLogin.password}
                    onChange={handleChangeLogin}
                    required
                  />
                  <div className="underline"></div>
                  <label >Mot de passe</label>
                </div>
              </div>
              <br></br>
              <div className="center-button">
                <button type="submit" className="submit-button">
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpLogin;
